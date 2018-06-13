import toposort from 'toposort'
import diff from 'shallow-diff'
import {
  setMergeInto
} from 'utils/sets'

const DEFAULT_SCOPE = {}

/**
 * Functions for evaluating a serialized description of mathematical symbols.
 * This includes sorting the symbols into a valid evaluation order.
 *
 * As an example, consider the serialized symbol:values 'scope' below:
 *
 *     a = b/2 - c
 *     b = g(4) + c
 *     c = -1
 *     d = +1
 *     f(x, y) = a*x^2 - b*y
 *     g(t) = t^3 - 1
 *     p = c^2 + d^2
 *     z = 1
 *
 * These symbol definitions forms a directed graph where parents represent
 * evaluation dependencies and must be evaluated first.
 *
 * Note that 'x', 'y', and 't' are function arguments and do not appear in our
 * dependency graph.
 *
 * d ----------->--- p
 *          /
 * c -->-------\
 *        \     -->-- a -->--- f
 * g -->-- b --/              /
 *         \                 /
 *         \-------->-------
 *
 * z        (isolated node)
 *
 * This module has two main responsibilities:
 *   1. Generate an initial symbol:value mapping from a serialized description.
 *   2. Update an exisiting symbol:value mapping when some variable values have
 *      changed. For example, when a single variable value changes, we do not
 *      need to re-evaluate the entire mathscope. In the example above, if 'b'
 *      changes from 'g(4)' to 'g(3) + p' we only need to update b and its
 *      descendants.
 *
 *  Low-level functions are combined in the MathScope class, which provides
 *  caching for faster re-computation.
 */

/**
 * evaluates a serialized scope from scratch or updates an existing scope
 *
 * @param  {Parser} parser for evaluating mathematical expressions
 * @param  {object} symbols
 * @param  {string} symbols[symbolName] An assignment expression,e.g.,
 *         a = b^2 or f(r, q) = r*sin(q)
 * @param  {?object} oldScope
 * @param  {number | function} oldScope[symbolName] a partial initial scope,
 *         e.g., { a: 4, b: -2, f: x => x**2 }
 * @param {?array | set} changed which serialized symbol values have changed.
 *  Starting from oldScope, only update these symbols and their children
 *
 * Note: The optional arguments oldScope and changed should NOT be used if
 * deleting symbols from or adding symbols to the scope. These arguments are
 * intended to improve performance when changing a single symbol's very often,
 * e.g., when the symbol's value is changed by a slider
 *
 * Comment about UNMET DEPENDENCIES:
 * We explicitly remove all unmet dependencies before trying to evaluate
 * anything because MathJS has trouble telling when FunctionAssignmentNodes
 * have unmet dependencies. In particular:
 *  - AssignmentNode:
 *    c = math.parse('c=a+b').eval({b:5}) // raises error, 'a is undefined'
 *  - FunctionAssignmentNode:
 *    f = math.parse('f(t)=t+a+b').eval({b:5}) // does not raise error
 *    f(1) // raises error
 *
 */
export function evalScope(parser, symbols, oldScope = DEFAULT_SCOPE, changed = null) {
  // Get the evaluation order and add symbols to scope
  const { childMap, unmetDependencies } = getChildMap(symbols, parser)

  const {
    safeSymbols,
    dependencyErrors
  } = removeUnmetDependencies(symbols, unmetDependencies)

  const evalOrder = getEvalOrder(safeSymbols, childMap, changed)
  const initial = {
    scope: { ...oldScope }, // copy oldScope, not mutate
    errors: dependencyErrors,
    updated: new Set(evalOrder)
  }

  return evalOrder.reduce((acc, symbolName) => {
    try {
      acc.scope[symbolName] = parser.parse(safeSymbols[symbolName] ).eval(acc.scope)
    }
    catch (err) {
      acc.errors[symbolName] = err
    }
    return acc
  }, initial)

}

function removeUnmetDependencies(symbols, unmetDependencies) {
  return { safeSymbols: symbols, dependencyErrors: {} }
}

/**
 * Determines a valid evaluation order for symbols. If onlyTheseAndChildren is
 * supplied, only returns those nodes and their children.
 *
 * @param  {object} symbols
 * @param  {string} symbols[symbolName] An assignment expression, e.g., a = b^2 or f(r, q) = r*sin(q)
 * @param  {Parser} parser
 * @param  {?array | Set} onlyTheseAndChildren
 *
 * @returns {array} of symbol names, a valid evaluation order for symbols
 */
export function getEvalOrder(symbols, childMap, onlyTheseAndChildren = null) {
  // construct dependency graph as array of nodes
  const nodesToInclude = onlyTheseAndChildren
    ? [...getDescendants(onlyTheseAndChildren, childMap)]
    : Object.keys(childMap)

  // Sort the non-isolated nodes
  // Alert! Isolated nodes---nodes without parents or children---are missed.
  // We'll add them in a moment
  const { edges, childless } = nodesToInclude.reduce((acc, node) => {
    if (childMap[node].size === 0) {
      acc.childless.push(node)
    }
    for (const child of childMap[node] ) {
      acc.edges.push( [node, child] )
    }
    return acc
  }, { edges: [], childless: [] } )
  const sorted = toposort(edges)
  const included = new Set(sorted)
  const isolated = childless.filter(node => !included.has(node))

  return [...sorted, ...isolated]
}

/**
 * Generates an object mapping symbol names to child symbols
 *
 * @param  {object} symbols
 * @param  {string} symbols[symbolName] An assignment expression, e.g., a = b^2 or f(r, q) = r*sin(q)
 * @param  {Parser} parser
 *
 * @returns {object} a mapping from symbol names to a set of direct children node names
 */
export function getChildMap(symbols, parser) {

  const initial = Object.keys(symbols).reduce((acc, symbolName) => {
    acc[symbolName] = new Set()
    return acc
  }, {} )

  // maps nodes to their direct unmet dependency
  const unmetDirectDependencies = {}

  const childMap = Object.keys(symbols).reduce((childMap, symbolName) => {
    const symbol = symbols[symbolName]
    const dependencies = parser.parse(symbol).dependencies
    dependencies.forEach(dep => {
      if (childMap[dep] === undefined) {
        childMap[dep] = new Set()
        unmetDirectDependencies[symbolName] = dep
      }
      childMap[dep].add(symbolName)
    } )
    return childMap
  }, initial)

  // for each node with a direct unmet dependency, mark all of its children
  // as having the same unmet dependency
  const unmetDependencies = Object.keys(unmetDirectDependencies).reduce(
    (acc, node) => {
      getDescendantsOfNode(node, childMap).forEach(
        d => { acc[d] = unmetDirectDependencies[node] }
      )
      return acc
    }, { } )

  return { childMap, unmetDependencies }

}

/**
 * get all descendants of a single node in a directed graph
 *
 * @param  {object} childMap
 * @param  {Set<string>} childMap[node] set of direct children nodenames
 */
export function getDescendantsOfNode(node, childMap) {
  const descendants = new Set( [node] )

  if (childMap[node].size === 0) {
    return descendants
  }

  childMap[node].forEach(child => {
    setMergeInto(descendants, getDescendantsOfNode(child, childMap))
  } )

  return descendants
}

export function getDescendants(nodes, childMap) {
  const children = new Set()
  nodes.forEach(node => {
    setMergeInto(children, getDescendantsOfNode(node, childMap))
  } )
  return children
}

export class ScopeEvaluator {

  constructor(parser) {
    this._parser = parser
  }

  _oldResult = {
    scope: {},
    errors: {},
    updated: {}
  }
  _oldSymbols = {}

  evalScope(symbols) {

    if (symbols === this._oldSymbols) {
      return this._oldResult
    }

    const { updatesOnly, changed } = ScopeEvaluator._detectChanges(symbols, this._oldSymbols)

    const result = updatesOnly
      ? this._patchScope(symbols, changed)
      : this._recalculateScope(symbols)

    this._updateState(symbols, result)
    return result

  }

  static _detectChanges(newSymbols, oldSymbols) {
    const { added, deleted, updated } = diff(newSymbols, oldSymbols)
    return {
      updatesOnly: added.length === 0 && deleted.length === 0,
      changed: updated
    }
  }

  _patchScope(symbols, changed) {
    return evalScope(this._parser, symbols, this._oldResult.scope, changed)
  }

  _recalculateScope(symbols) {
    return evalScope(this._parser, symbols)
  }

  _updateState(symbols, result) {
    this._oldSymbols = symbols
    this._oldResult = result
  }

}

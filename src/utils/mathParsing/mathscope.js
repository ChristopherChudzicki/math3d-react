// @flow

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

import toposort from 'toposort'
import Graph from 'tarjan-graph'
import diff from 'shallow-diff'
import {
  setMergeInto
} from 'utils/sets'
import math from 'utils/mathjs'
import type Parser from './Parser'
import type { Evaluated } from './MathExpression'

const DEFAULT_SYMBOL_NAMES = new Set(Object.keys(math))

type Symbols = {
  [symbolName: string]: string
}
type Scope = {
  [symbolName: string]: Evaluated
}
type ScopeErrors = {
  [symbolName: string]: Error
}
type ChildMap = {
  [nodeName: string]: Set<string>
}

/**
 * evaluates a serialized scope from scratch or updates an existing scope
 *
 * @param  {Parser} parser for evaluating mathematical expressions
 * @param  {Symbols} symbols, must be parseable!
 * @param  {?Scope} oldScope
 * @param {?array|set} changed which serialized symbol values have changed.
 *   Starting from oldScope, only update these symbols and their children
 *
 * Note: The optional arguments oldScope and changed should NOT be used if
 * deleting symbols from or adding symbols to the scope. These arguments are
 * intended to improve performance when changing a single symbol's very often,
 * e.g., when the symbol's value is changed by a slider
 *
 */
export function evalScope(
  parser: Parser,
  symbols: Symbols,
  oldScope: Scope = {},
  changed: ?(Set<string> | Array<string>) = null
): {scope: Scope, errors: ScopeErrors} {
  // Get the evaluation order and add symbols to scope
  const childMap = getChildMap(symbols, parser)

  const { evalOrder, cycles } = getEvalOrder(symbols, childMap, changed)
  const errors: { [string]: Error } = Object.keys(cycles)
    .reduce((acc, node) => {
      const deps = cycles[node].join(', ')
      acc[node] = Error(`Symbol ${node} has cyclic dependencies: ${deps}`)
      return acc
    }, {} )

  const initial = {
    scope: { ...oldScope }, // copy oldScope, not mutate
    errors: errors
  }

  const rawResult = evalOrder.reduce((acc, symbolName) => {
    try {
      acc.scope[symbolName] = parser.parse(symbols[symbolName] ).eval(acc.scope)
    }
    catch (err) {
      acc.errors[symbolName] = err
    }
    return acc
  }, initial)

  // rawResult.scope might include some functions that cannot actually be
  // evaluated. For example,
  // >>> evalScope(parser, { f: 'f()=x' } )
  // adds a function f to scope that throws Undefined symbol upon evaluation.
  return removeFunctionsWithMissingDeps(parser, symbols, evalOrder, rawResult)

}

function removeFunctionsWithMissingDeps(
  parser: Parser,
  symbols: Symbols,
  evalOrder: Array<string>,
  rawResult: {errors: ScopeErrors, scope: Scope}
) {
  const functions = evalOrder.filter(symbolName => {
    return typeof rawResult.scope[symbolName] === 'function'
  } )

  return functions.reduce((acc, symbolName) => {
    const directDependencies = parser.parse(symbols[symbolName] ).dependencies
    const unmet = [...directDependencies].filter(dep => acc.scope[dep] === undefined)
    if (unmet.length > 0) {
      delete acc.scope[symbolName]
      const names = unmet.join(', ')
      acc.errors[symbolName] = Error(`Eval Error: Depends on undefined symbol(s) ${names}`)
      // what to do with updated?
    }
    return acc
  }, rawResult)
}

/**
 * Determines a valid evaluation order for symbols. If onlyTheseAndChildren is
 * supplied, only returns those nodes and their children.
 *
 * @param  {Symbols} symbols
 * @param  {ChildMap} childMap pre-calculated for symbols
 * @param  {?array|Set} onlyTheseAndChildren
 *
 * @returns {array} of symbol names, a valid evaluation order for symbols
 */
export function getEvalOrder(
  symbols: Symbols,
  childMap: ChildMap,
  onlyTheseAndChildren: ?(Set<string> | Array<string>) = null
): {
  evalOrder: Array<string>,
  cycles: { [nodeName: string]: Array<string> }
} {
  // construct dependency graph as array of nodes
  const nodesToInclude = onlyTheseAndChildren
    ? [...getDescendants(onlyTheseAndChildren, childMap)]
    : Object.keys(childMap)

  let sorted, isolated, edges, cycles, withoutCycles
  try {
    ( { edges, isolated } = getSubgraphEdges(childMap, nodesToInclude))
    sorted = toposort(edges)
    cycles = {}
  }
  catch (error) {
    if (error.message.startsWith('Cyclic dependency')) {
      ( { withoutCycles, cycles } = removeCycles(childMap));
      ( { edges, isolated } = getSubgraphEdges(withoutCycles,
        nodesToInclude.filter(node => !cycles.hasOwnProperty(node))
      ))
      sorted = toposort(edges)
    }
    else {
      throw error
    }
  }

  const evalOrder = [...sorted, ...isolated]

  return { evalOrder, cycles }
}

// Gets edges and isolated nodes
export function getSubgraphEdges(
  childMap: ChildMap,
  nodesToInclude: Array<string>
): {
  edges: Array<[string, string]>,
  isolated: Array<string>
} {
  // This set will hold nodes who have parents
  const haveParents: Set<string> = new Set()
  const { edges, childless } = nodesToInclude.reduce((acc, node) => {
    if (childMap[node].size === 0) {
      acc.childless.push(node)
    }
    for (const child of childMap[node] ) {
      acc.edges.push( [node, child] )
      haveParents.add(child)
    }
    return acc
  }, { edges: [], childless: [] } )

  // Isolated nodes are childless AND parentless
  const isolated = childless.filter(node => !haveParents.has(node))

  return { edges, isolated }
}

export function removeCycles(childMap: ChildMap): {
  withoutCycles: ChildMap,
  cycles: {[string]: Array<string>}
} {
  const graph = new Graph()
  for (const key of Object.keys(childMap)) {
    graph.add(key, [...childMap[key]] )
  }
  // graph.getCycles does not include any strongly-connected components of
  // length 1, even cycles of length 1
  const connected = graph.getStronglyConnectedComponents().filter(scc => {
    return scc.length > 1 || scc[0].successors.includes(scc[0] )
  } )

  // For each node involved in cycle, record which other nodes are involved in
  // the same cycle
  const cycles: {[string]: Array<string>} = {}
  connected.forEach(scc => {
    const nodeNames = scc.map(vertex => vertex.name)
    nodeNames.sort()
    scc.forEach(vertex => {
      cycles[vertex.name] = nodeNames
    } )
  } )

  const cyclicNodes = new Set(Object.keys(cycles))
  const withoutCycles = Object.keys(childMap).reduce((acc, node) => {
    if (cyclicNodes.has(node)) {
      return acc
    }
    // get children not involved in cycles
    const children = [...childMap[node]].filter(x => !cyclicNodes.has(x))
    acc[node] = new Set(children)
    return acc
  }, {} )

  return { withoutCycles, cycles }
}

/**
 * Detect direct children of all nodes and detect nodes with unmet dependencies
 *
 * @param  {Symbols} symbols
 * @param  {Parser} parser
 *
 * @returns {ChildMap}
 */
export function getChildMap(symbols: Symbols, parser: Parser): ChildMap {

  const initial = Object.keys(symbols).reduce((acc, symbolName) => {
    acc[symbolName] = new Set()
    return acc
  }, {} )

  const childMap = Object.keys(symbols).reduce((childMap, symbolName) => {
    const symbol = symbols[symbolName]
    const dependencies = parser.parse(symbol).dependencies

    // remove defaults from dependencies
    dependencies.forEach(dep => {
      const skip = DEFAULT_SYMBOL_NAMES.has(dep) && !symbols[dep]
      skip && dependencies.delete(dep)
    } )

    dependencies.forEach(dep => {
      childMap[dep] && childMap[dep].add(symbolName)
    } )
    return childMap
  }, initial)

  return childMap

}

/**
 * get all descendants of a single node in a directed graph
 *
 * @param  {ChildMap} childMap
 * @returns {set} the given node and all of its descendents
 */
export function getDescendantsOfNode(node: string, childMap: ChildMap) {
  const descendants: Set<string> = new Set( [node] )

  if (childMap[node].size === 0) {
    return descendants
  }

  childMap[node].forEach(child => {
    setMergeInto(descendants, getDescendantsOfNode(child, childMap))
  } )

  return descendants
}

/**
 * get all descendants of nodes in a directed graph
 *
 * @param  {set|array} nodes
 * @returns {set} the given nodes and all of their descendents
 */
export function getDescendants(
  nodes: Set<string> | Array<string>,
  childMap: ChildMap
) {
  const children: Set<string> = new Set()
  nodes.forEach(node => {
    setMergeInto(children, getDescendantsOfNode(node, childMap))
  } )
  return children
}

type Diff = {
  unchanged: Array<string>,
  updated: Array<string>,
  deleted: Array<string>,
  added: Array<string>
}

type Result = {
  scope: Scope,
  scopeDiff: Diff,
  errors: ScopeErrors,
  errorsDiff: Diff
}

export class ScopeEvaluator {

  _parser: Parser
  _oldResult: Result = {
    scope: {},
    scopeDiff: {
      unchanged: [],
      updated: [],
      added: [],
      deleted: []
    },
    errors: {},
    errorsDiff: {
      unchanged: [],
      updated: [],
      added: [],
      deleted: []
    }
  }
  _oldSymbols: Symbols = {}

  constructor(parser: Parser) {
    this._parser = parser
  }

  evalScope(symbols: Symbols) {

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

  static _detectChanges(newSymbols: Symbols, oldSymbols: Symbols) {
    const { added, deleted, updated } = diff(newSymbols, oldSymbols)
    return {
      updatesOnly: added.length === 0 && deleted.length === 0,
      changed: updated
    }
  }

  _patchScope(symbols: Symbols, changed: Array<string>) {
    const { scope, errors } = evalScope(this._parser, symbols, this._oldResult.scope, changed)

    // errors only includes errors in changed symbols.
    // Add back all the old errors, except the ones that are now in-scope or
    // have a new error message.
    const combinedErrors = Object.keys(this._oldResult.errors).filter(
      symbolName => !scope[symbolName] && !errors[symbolName]
    ).reduce((acc, symbolName) => {
      acc[symbolName] = this._oldResult.errors[symbolName]
      return acc
    }, errors)

    return {
      scope: scope,
      errors: combinedErrors,
      scopeDiff: diff(this._oldResult.scope, scope),
      errorsDiff: diff(this._oldResult.errors, combinedErrors)
    }

  }

  _recalculateScope(symbols: Symbols) {
    const { scope, errors } = evalScope(this._parser, symbols)
    return {
      scope,
      errors,
      scopeDiff: diff(this._oldResult.scope, scope),
      errorsDiff: diff(this._oldResult.errors, errors)
    }
  }

  _updateState(symbols: Symbols, result: Result) {
    this._oldSymbols = symbols
    this._oldResult = result
  }

}

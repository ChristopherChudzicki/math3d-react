import toposort from 'toposort'

const DEFAULT_SCOPE = {}

/**
 * @module mathscope
 * Functions for evaluating a serialized description of mathematical symbols.
 * This includes sorting the symbols into a valid evaluation order.
 *
 * As an example, consider the serialized "mathscope" below:
 *
 *     a = b/2 - c
 *     b = h(4) + c
 *     c = -1
 *     d = +1
 *     f(x, y) = a*x^2 - b*y
 *     h(t) = t^2 -1
 *     p = c^2 + d^2
 *
 * This scope of mathematical symbols forms a directed graph
 * where parents represent evaluation dependencies and must be
 * evaluated first.
 *
 * Note that 'x', 'y', and 't' are function arguments and do not appear in our
 * dependency graph.
 *
 * d ----------->--- p
 *          /
 * c -->-------\
 *        \     -->-- a -->--- f
 * h -->-- b --/              /
 *         \                 /
 *         \-------->-------
 *
 * This module has two main responsibilities:
 *   1. Generate an initial mathscope from a serialized description.
 *   2. Update an exisiting mathscope when a symbol value has changed.
 *      When a single variable changes, we do not need to re-evaluate the entire
 *      mathscope. In the example above, if 'b' changes from 'g(4)' to
 *      'g(3) + p' we only need to update the descendants of g.
 */

/**
 * Generates an object mapping symbol names to symbol values
 *
 * @param  {object} symbols
 * @param  {string} symbols[symbolName] An assignment expression, e.g., a = b^2 or f(r, q) = r*sin(q)
 * @param  {Parser} parser
 */
export function updateMathScope(symbols, parser, initialScope, updateChildrenOf) {
  // Get the evaluation order
  // add symbols to scope

  const evalOrder = getEvalOrder(symbols, parser, updateChildrenOf)
  const initial = {
    mathScope: { ...initialScope }, // copy initialScope, not mutate
    errors: {},
    updated: evalOrder
  }

  return evalOrder.reduce((acc, symbolName) => {
    try {
      acc.mathScope[symbolName] = parser.parse(symbols[symbolName] ).eval(acc.mathScope)
    }
    catch (err) {
      acc.errors[symbolName] = err
    }
    return acc
  }, initial)

}
export function genMathScope(symbols, parser) {
  return updateMathScope(symbols, parser, DEFAULT_SCOPE, null)
}

/**
 * Determines a valid evaluation order for symbols. If onlyChildrenOf is
 * supplied, only returns children of those node.
 *
 * @param  {object} symbols
 * @param  {string} symbols[symbolName] An assignment expression, e.g., a = b^2 or f(r, q) = r*sin(q)
 * @param  {Parser} parser
 * @param  {?array || Set} onlyChildrenOf
 *
 * @returns {array} of symbol names, a valid evaluation order for symbols
 */
export function getEvalOrder(symbols, parser, onlyChildrenOf = null) {
  // construct dependency graph as array of nodes
  const childMap = getChildMap(symbols, parser)
  const nodesToInclude = onlyChildrenOf
    ? [...getDescendants(onlyChildrenOf, childMap)]
    : Object.keys(childMap)

  // Sort the nodes with children
  const edges = nodesToInclude.reduce((acc, node) => {
    for (const child of childMap[node] ) {
      acc.push( [node, child] )
    }
    return acc
  }, [] )
  const sorted = toposort(edges)

  // If the changed node has no children, it will not be included in the sorting
  // above. So add it now.
  onlyChildrenOf && onlyChildrenOf.forEach(item => {
    if (!sorted.includes(item)) {
      sorted.push(item)
    }
  } )

  return sorted
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

  return Object.keys(symbols).reduce((childMap, symbolName) => {
    const symbol = symbols[symbolName]
    const dependencies = parser.parse(symbol).dependencies
    for (const dep of dependencies) {
      childMap[dep].add(symbolName)
    }
    return childMap
  }, initial)

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

/**
 * merges one set into another
 *
 * @param {set} target target set, mutated and returned
 * @param {set} source whose elements are merged into target
 */
function setMergeInto(target, source) {
  for (const item of source) {
    target.add(item)
  }
  return target
}

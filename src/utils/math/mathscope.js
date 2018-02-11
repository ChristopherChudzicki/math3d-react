import toposort from 'toposort'

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
export function genMathScope(symbols, parser) {
  // Get the evaluation order
  // add symbols to scope
  //  - be careful with functions

  getEvalOrder(symbols, parser)

  return {}
}

/**
 * Determines a valid evaluation order for symbols. If startingNode is supplied,
 * only returns children of that node.
 *
 * @param  {object} symbols
 * @param  {string} symbols[symbolName] An assignment expression, e.g., a = b^2 or f(r, q) = r*sin(q)
 * @param  {Parser} parser
 * @param  {?string} startingNode
 *
 * @returns {array} of symbol names, a valid evaluation order for symbols
 */
export function getEvalOrder(symbols, parser, startingNode) {
  // construct dependency graph as array of nodes
  const childMap = getChildMap(symbols, parser)
  const nodesToInclude = startingNode ? getDescendants(startingNode, childMap) : null

  const nodes = Object.keys(childMap).reduce((acc, node) => {
    if (startingNode && !nodesToInclude.has(node)) {
      return acc
    }

    for (const child of childMap[node] ) {
      acc.push( [node, child] )
    }
    return acc
  }, [] )

  return toposort(nodes)
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
 * get all descendants of a given node in a directed graph
 *
 * @param  {object} childMap
 * @param  {Set<string>} childMap[node] set of direct children nodenames
 */
export function getDescendants(node, childMap) {
  if (childMap[node].size === 0) {
    return new Set( [node] )
  }
  const descendants = new Set(node)
  childMap[node].forEach(child => {
    setMergeInto(descendants, getDescendants(child, childMap))
  } )

  return descendants
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

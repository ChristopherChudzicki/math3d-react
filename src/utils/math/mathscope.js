import toposort from 'toposort'

export function genMathScope(symbols, parserCache) {
  // Get the evaluation order
  // add symbols to scope
  //  - be careful with functions

  getEvalOrder(symbols, parserCache)

  return {}
}

export function getEvalOrder(symbols, parserCache) {
  // construct dependency graph as array of nodes

  const graph = Object.keys(symbols).reduce(
    (nodes, symbolName) => {
      const symbol = symbols[symbolName]

      // Add a new node for each dependency
      const newNodes = parserCache.getParsed(symbol.expression).dependencies
        // Except not for function arguments
        .filter(
          dependency => !symbol.isFunction || !symbol.arguments.includes(dependency)
        )
        .map(
          dependency => [dependency, symbolName]
        )

      return [...nodes, ...newNodes]
    }, []
  )

  return toposort(graph)
}

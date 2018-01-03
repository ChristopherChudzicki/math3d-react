import math from 'mathjs'

/**
 * Uses math.parse to parse a math expression into a tree. Holds the tree and
 * some helper information (e.g., variable and function dependencies) and
 * provides some helper methods.
 */
export default class ParsedExpression {

  parseTree = null
  error = null
  // these store dependencies required before evaluation
  functionsUsed = null
  variablesUsed = null

  constructor(string) {
    try {
      this.parseTree = math.parse(string)
      const { variablesUsed, functionsUsed } = this.getDependencies()
      this.variablesUsed = variablesUsed
      this.functionsUsed = functionsUsed
    }
    catch (error) {
      this.error = error
      throw (error)
    }
  }

  getDependencies() {
    const variablesUsed = []
    const functionsUsed = []

    this.parseTree.traverse(node => {
      if (node.type === 'SymbolNode') {
        variablesUsed.push(node.name)
      }
      else if (node.type === 'FunctionNode') {
        functionsUsed.push(node.name)
      }
    } )

    return { variablesUsed, functionsUsed }
  }

}

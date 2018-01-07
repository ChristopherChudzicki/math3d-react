import math from 'mathjs'

/**
 * Uses math.parse to parse a math expression into a tree. Holds the tree and
 * some helper information (e.g., variable and function dependencies) and
 * provides some helper methods.
 */
export default class ParsedExpression {

  string = null // original expression
  parseTree = null // mathjs parse tree
  error = null // errors generated during mathjs parsing
  eval = null // compiled evaluation function, scope => value
  functionsUsed = null // functions required in scope for evaluation
  variablesUsed = null // variables required in scope for evaluation

  /**
  * @param {string} string math expression to be parsed
  * @param {{preprocessors: array}} config options:
  *  - preprocessors is an array of function mapping strings to strings.
  */
  constructor(string, { preprocessors = [] } = {} ) {
    try {
      this.string = string
      this.parseTree = math.parse(this._preprocess(preprocessors))
      this.eval = this._assignEval()
      const { variablesUsed, functionsUsed } = this._getDependencies()
      this.variablesUsed = variablesUsed
      this.functionsUsed = functionsUsed
    }
    catch (error) {
      this.error = error
      throw (error)
    }
  }

  _preprocess(preprocessors) {
    return preprocessors.reduce((acc, f) => f(acc), this.string)
  }

  _getDependencies() {
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

  _assignEval() {
    const compiled = this.parseTree.compile()

    // If expression contains '[', assume that it is an array and will evaluate
    // to a MathJS DenseMatrix. Covert it to a normal js array
    // TODO: this is brittle. E.g., would try to covert [1, 2, 3] dot [2,0,1]
    // to an array.
    if (this.string.includes('[')) {
      return scope => compiled.eval(scope).toArray()
    }
    return scope => compiled.eval(scope)
  }

}

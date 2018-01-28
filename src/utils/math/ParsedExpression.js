import math from 'mathjs'

/**
 * Uses math.parse to parse a math expression into a tree. Holds the tree and
 * some helper information (e.g., variable and function dependencies) and
 * provides some helper methods.
 */
export default class ParsedExpression {

  string = null // original expression
  parseTree = null // mathjs parse tree
  eval = null // compiled evaluation function, scope => value
  dependencies = [] // variables and functions required for evaluation

  /**
  * @param {string} expression to be parsed
  * @param {array<function>} preprocessors array of functions mapping strings to strings. These functions are applied to expression before being parsed by mathjs.
  * @param {array<function>} postprocessors array of functions mapping strings to strings. These functions are applied to expression before being parsed by mathjs.
  *  - preprocessors is an array of function mapping strings to strings.
  */
  constructor(expression, preprocessors = [], postprocessors = [] ) {
    this.string = expression

    this.parseTree = math.parse(this._preprocess(preprocessors))
    this._postprocess(postprocessors)

    this.eval = this._assignEval()
    this.dependencies = this._getDependencies()
  }

  _preprocess(preprocessors) {
    return preprocessors.reduce((acc, f) => f(acc), this.string)
  }

  _postprocess(postprocessors) {
    postprocessors.map(f => {
      this.parseTree.traverse(node => f(node))
    } )
  }

  _getDependencies() {
    const dependencies = []

    this.parseTree.traverse(node => {
      if (node.type === 'SymbolNode' || node.type === 'FunctionNode') {
        dependencies.push(node.name)
      }
      return dependencies
    } )

    return dependencies
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

import math from 'mathjs'

/**
 * Uses math.parse to parse a math expression into a tree. Holds the tree and
 * some helper information/methods.
 */
export default class MathExpression {

  name = null
  string = null // original expression
  tree = null // mathjs parse tree
  eval = null // compiled evaluation function, scope => value
  dependencies = null // variables and functions required for evaluation

  /**
  * @param {string} expression to be parsed
  * @param {array<function>} preprocessors array of functions mapping strings to strings. These functions are applied to expression before being parsed by mathjs.
  * @param {array<function>} postprocessors array of functions mapping strings to strings. These functions are applied to expression before being parsed by mathjs.
  *  - preprocessors is an array of function mapping strings to strings.
  */
  constructor(expression, preprocessors = [], postprocessors = [] ) {
    this.string = expression
    this.tree = math.parse(this._preprocess(preprocessors))
    this.name = this.tree.name ? this.tree.name : null
    this._postprocess(postprocessors)

    this.eval = this._getEval()
    this.dependencies = this._getDependencies()
  }

  _preprocess(preprocessors) {
    return preprocessors.reduce((acc, f) => f(acc), this.string)
  }

  _postprocess(postprocessors) {
    postprocessors.map(f => {
      this.tree.traverse(node => f(node))
    } )
  }

  _getDependencies() {
    const dependencies = new Set()

    // In case of assignment, use right-hand-side as tree
    const rhs = (this.tree.type === 'AssignmentNode')
      ? this.tree.value
      : (this.tree.type === 'FunctionAssignmentNode')
        ? this.tree.expr
        : this.tree

    const params = (this.tree.type === 'FunctionAssignmentNode')
      ? this.tree.params
      : []

    rhs.traverse(node => {
      if (node.type === 'SymbolNode' || node.type === 'FunctionNode') {
        if (!params.includes(node.name)) {
          dependencies.add(node.name)
        }
      }

      if ( [...dependencies, ...params].includes(this.tree.name)) {
        throw Error('Cyclic Assignment Error')
      }

      return dependencies
    } )

    return dependencies
  }

  _getEval() {
    const compiled = this.tree.compile()

    // If expression contains '[', assume that it is an array and will evaluate
    // to a MathJS DenseMatrix. Covert it to a normal js array
    // TODO: this is brittle. E.g., would try to covert [1, 2, 3] dot [2,0,1]
    // to an array.
    const toArray = this.string.includes('[')

    return toArray
      ? scope => compiled.eval(scope).toArray()
      : scope => compiled.eval(scope)
  }

}

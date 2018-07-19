// @flow
import math from '../mathjs'
import type {
  Node
} from '../mathjs/types'

type ParseNode = any
type PostProcessor = (ParseNode) => void
type PreProcessor = (expression: string) => string

type Evaluated = number | Array<Evaluated> | (...Array<Evaluated>) => Evaluated
type Scope = {
  [symbol_name: string]: Evaluated
}

/**
 * Uses math.parse to parse a math expression into a tree. Holds the tree and
 * some helper information/methods.
 */
export default class MathExpression {

  string: string
  dependencies: Set<string> // direct dependencies!
  tree: Node
  name = null
  eval = null // compiled evaluation function, scope => value

  /**
  * @param {string} expression to be parsed
  * @param {array<function>} preprocessors array of functions mapping strings to strings. These functions are applied to expression before being parsed by mathjs.
  * @param {array<function>} postprocessors array of functions called on the part tree's nodes. These functions are applied to expression before being parsed by mathjs.
  *  - preprocessors is an array of function mapping strings to strings.
  */
  constructor(
    expression: string,
    preprocessors: Array<PreProcessor> = [],
    postprocessors: Array<PostProcessor> = []
  ) {
    this.string = expression
    this.tree = math.parse(this._preprocess(preprocessors))
    this.name = this.tree.name ? this.tree.name : null
    this._postprocess(postprocessors)

    this.eval = this._getEval()
    this.dependencies = this._getDependencies()
  }

  _preprocess(preprocessors: Array<PreProcessor>) {
    return preprocessors.reduce((acc, f) => f(acc), this.string)
  }

  _postprocess(postprocessors: Array<PostProcessor>) {
    postprocessors.map(f => {
      this.tree.traverse(node => f(node))
    } )
  }

  static _getRHS(node: Node) {
    if (node.type === 'AssignmentNode') {
      return node.value
    }
    if (node.type === 'FunctionAssignmentNode') {
      return node.expr
    }
    return node
  }

  _getDependencies() {
    const dependencies: Set<string> = new Set()
    const isAssignmentNode = (this.tree.type === 'AssignmentNode')
    const isFunctionAssignmentNode = (this.tree.type === 'FunctionAssignmentNode')

    // In case of assignment, use right-hand-side as tree
    const rhs = MathExpression._getRHS(this.tree)

    const params = (this.tree.type === 'FunctionAssignmentNode')
      ? this.tree.params
      : []

    rhs.traverse((node: Node) => {
      if (node.type === 'SymbolNode' || node.type === 'FunctionNode') {
        if (!params.includes(node.name)) {
          dependencies.add(node.name)
        }
      }

      if (isAssignmentNode || isFunctionAssignmentNode) {
        if ( [...dependencies, ...params].includes(this.tree.name)) {
          throw Error('Cyclic Assignment Error')
        }
      }
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
      ? (scope:Scope): Array<Evaluated> => compiled.eval(scope).toArray()
      : (scope:Scope): Evaluated => compiled.eval(scope)
  }

}

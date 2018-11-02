// @flow
import math from 'utils/mathjs'
import type { Node } from 'utils/mathjs/types'
import memoizeOne from 'memoize-one'

export type PostProcessor = (Node) => void
export type PreProcessor = (expression: string) => string
export type Evaluated = number | Array<Evaluated> | (...Array<Evaluated>) => Evaluated
export type Scope = {
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
  eval: ((scope:Scope) => Array<Evaluated>) | ((scope:Scope) => Evaluated)
  name = null

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

    this.dependencies = this._getDependencies()

    // $FlowFixMe memoizeOne expects itsequality function arguments to be of type mixed, but we specify that they are of type Scope
    this.eval = memoizeOne(this._getEval(), this._getSubscopeEquality())
  }

  _preprocess(preprocessors: Array<PreProcessor>) {
    return preprocessors.reduce((acc, f) => f(acc), this.string)
  }

  _postprocess(postprocessors: Array<PostProcessor>) {
    postprocessors.forEach(f => {
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

    return (scope: Scope): Evaluated => {
      const localScope = { ...scope }
      const raw = compiled.eval(localScope)
      if (raw instanceof math.type.DenseMatrix) {
        return raw.toArray()
      }
      if (raw instanceof Function) {
        const temp = (...args) => {
          let result

          if (raw.length > 1 && args.length === 1 && Array.isArray(args[0] )) {
            // This allways for inputing a vector expression into a multivariable function
            result = raw(...args[0] )
          }
          else {
            result = raw(...args)
          }

          if (result instanceof math.type.DenseMatrix) {
            return result.toArray()
          }
          return result
        }
        Object.defineProperty(temp, 'length', { value: raw.length } )
        Object.defineProperty(temp, 'name', { value: raw.name } )
        return temp
      }
      return raw
    }
  }

  _getSubscopeEquality() {
    const subscopeEquality = (newScope: Scope, oldScope: Scope) => {
      for (const symbol of this.dependencies) {
        if (newScope[symbol]===undefined && math[symbol]===undefined) {
          return false
        }
        else if (newScope[symbol] !== oldScope[symbol] ) {
          return false
        }
      }
      return true
    }
    return subscopeEquality
  }

}

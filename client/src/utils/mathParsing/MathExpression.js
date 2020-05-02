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
  preprocessors: Array<PreProcessor>
  postprocessors: Array<PostProcessor>
  name = null

  /**
  * @param {string} expression to be parsed
  * @param {array<PreProcessor>} preprocessors array of functions mapping strings to strings. These functions are applied to expression before being parsed by mathjs.
  * @param {array<PostProcessor>} postprocessors array of functions called on the part tree's nodes. These functions are applied to expression before being parsed by mathjs.
  *  - preprocessors is an array of function mapping strings to strings.
  */
  constructor(
    expression: string,
    preprocessors: Array<PreProcessor> = [],
    postprocessors: Array<PostProcessor> = []
  ) {
    this.preprocessors = preprocessors
    this.postprocessors = postprocessors
    this.string = expression
    this.tree = this.parse(expression)
    this.name = this.tree.name ? this.tree.name : null

    this.dependencies = this._getDependencies()

    // $FlowFixMe memoizeOne expects its equality function arguments to be of type mixed, but we specify that they are of type Scope
    this.eval = memoizeOne(this._getEval(), this._getSubscopeEquality())
  }

  parse(expression: string) {
    try {
      const preprocessed = this._preprocess(expression, this.preprocessors)
      const tree = math.parse(preprocessed)
      this._postprocess(tree, this.postprocessors)
      return math.parse(preprocessed)
    } catch (error) {
      modifyParseError(error)
      throw error
    }
  }

  _preprocess(expression: string, preprocessors: Array<PreProcessor>) {
    return preprocessors.reduce((acc, f) => f(acc), expression)
  }

  _postprocess(tree: Node, postprocessors: Array<PostProcessor>) {
    postprocessors.forEach(f => {
      tree.traverse(node => f(node))
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
        const temp1 = (...args) => {
          try {
            return raw(...args)
          } catch (error) {
            modifyEvalError(error)
            throw error
          }
        }
        const temp2 = (...args) => {
          let result

          if (raw.length > 1 && args.length === 1 && Array.isArray(args[0] )) {
            // This allways for inputing a vector expression into a multivariable function
            result = temp1(...args[0])
          }
          else {
            result = temp1(...args)
          }

          if (result instanceof math.type.DenseMatrix) {
            return result.toArray()
          }
          return result
        }
        Object.defineProperty(temp2, 'length', { value: raw.length } )
        Object.defineProperty(temp2, 'name', { value: raw.name } )
        return temp2
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

function appendExplicitMultiplicationHint(error) {
  if (!error.message.endsWith('.')) {
    error.message += '. ';
  }
  error.message += "If multiplication is intended, an explicit * symbol is required."
}

function modifyParseError(error) {
  if (error.message.includes('Unexpected operator [')) {
    appendExplicitMultiplicationHint(error)
  }
}

function modifyEvalError(error) {
  if (error.message.startsWith('Cannot apply index')) {
    appendExplicitMultiplicationHint(error)
  }
}
// @flow
import * as React from 'react'
import { Parser } from 'utils/mathParsing'
import type { Scope } from 'utils/mathParsing/MathExpression'
import type { ErrorData } from 'services/errors/ErrorData'

// TODO:
// - handle errors
// - do not recalculate unless necessary
// - tests

type Props = {
  parser: Parser,
  scope: Scope,
  toEvaluate: { [symbolName: string]: string },
  onEvalError: (id: string, property: string, errorData: ErrorData) => any,
  children: (Scope) => React.Node
}

export default class EvaluationResult extends React.Component<Props> {

  evaluate(): Scope {
    const {
      parser,
      scope,
      toEvaluate
    } = this.props

    return Object.keys(toEvaluate).reduce(
      (result, key) => {
        result[key] = parser.parse(toEvaluate[key] ).eval(scope)
        return result
      }, { } )
  }

  render() {
    const result = this.evaluate()
    return this.props.children(result)
  }

}

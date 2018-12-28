// @flow
import React, { PureComponent } from 'react'
import StatusSymbol from './StatusSymbol'
import type { Scope, Parser } from 'utils/mathParsing'
import { MathScopeConsumer } from 'containers/MathScopeContext'
import typeof {
  toggleProperty,
  setProperty
} from 'containers/MathObjects/actions'
import { parser } from 'constants/parsing'


type Props = {
  id: string,
  type: string,
  visible: boolean,
  useCalculatedVisibility: boolean,
  calculatedVisibility: string,
  color: string,
  colors?: Array<string>,
  toggleProperty: toggleProperty,
  setProperty: setProperty,
  parser: Parser
}

export default class EvaluatedStatusSymbol extends PureComponent<Props> {

  static defaultProps = { parser }

  onToggleVisibility = () => {
    const { id, type } = this.props
    this.props.toggleProperty(id, type, 'visible')
  }

  onPickColor = (value: string) => {
    const { id, type } = this.props
    this.props.setProperty(id, type, 'color', value)
  }

  renderStatusSymbol = ( { scope }: { scope: Scope } ) => {
    const {
      calculatedVisibility,
      useCalculatedVisibility,
      visible,
      parser
    } = this.props
    let trueVisibility
    if (useCalculatedVisibility && calculatedVisibility !== '') {
      try {
        trueVisibility = Boolean(parser.parse(calculatedVisibility).eval(scope))
      }
      catch (err) {
        trueVisibility = visible
      }
    }
    else {
      trueVisibility = visible
    }
    return (
      <StatusSymbol
        colors={this.props.colors}
        color={this.props.color}
        isFilled={trueVisibility}
        onToggleVisibility={this.onToggleVisibility}
        onPickColor={this.onPickColor}
      />
    )
  }

  render() {
    return (
      <MathScopeConsumer>
        {this.renderStatusSymbol}
      </MathScopeConsumer>
    )
  }

}

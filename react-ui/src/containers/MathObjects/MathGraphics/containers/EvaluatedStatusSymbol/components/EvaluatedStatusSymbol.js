// @flow
import * as React from 'react'
import StatusSymbol from './StatusSymbol'
import type { Scope, Parser } from 'utils/mathParsing'
import { MathScopeConsumer } from 'containers/MathScopeContext'
import typeof {
  toggleProperty,
  setProperty
} from 'containers/MathObjects/actions'
import { parser } from 'constants/parsing'

export type DefaultProps = {|
  parser: Parser
|}
export type OwnProps = {|
  ...DefaultProps,
  id: string,
  extraTabs?: React.Node,
  colors?: Array<string>,
|}
type StateProps = {|
  color: string,
  visible: boolean,
  useCalculatedVisibility: boolean,
  type: string,
  calculatedVisibility: string
|}
type DispatchProps = {|
  toggleProperty: toggleProperty,
  setProperty: setProperty,
|}
export type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
|}

export default class EvaluatedStatusSymbol extends React.PureComponent<Props> {

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
        extraTabs={this.props.extraTabs}
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

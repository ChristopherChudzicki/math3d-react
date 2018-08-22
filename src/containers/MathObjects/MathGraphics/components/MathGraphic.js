// @flow
import * as React from 'react'
import MathObject from 'containers/MathObjects/MathObject'
import { StatusSymbol } from 'containers/MathObjects/components'
import typeof {
  toggleProperty,
  setProperty
} from 'containers/MathObjects/actions'

type Props = {
  id: string,
  type: string,
  color: string,
  visible: bool,
  toggleProperty: toggleProperty,
  setProperty: setProperty,
  children: React.Node
}

export default class MathGraphic extends React.PureComponent<Props> {

  constructor(props: Props) {
    super(props)
    // $FlowFixMe: https://github.com/facebook/flow/issues/1517
    this.onToggleVisibility = this.onToggleVisibility.bind(this)
    // $FlowFixMe: https://github.com/facebook/flow/issues/1517
    this.onPickColor = this.onPickColor.bind(this)
  }

  onToggleVisibility() {
    const { id, type } = this.props
    this.props.toggleProperty(id, type, 'visible')
  }

  onPickColor(value: string) {
    const { id, type } = this.props
    this.props.setProperty(id, type, 'color', value)
  }

  render() {
    return (
      <MathObject
        id={this.props.id}
        type={this.props.type}
        sidePanelContent={
          <StatusSymbol
            color={this.props.color}
            isFilled={this.props.visible}
            onToggleVisibility={this.onToggleVisibility}
            onPickColor={this.onPickColor}
          />
        }
      >
        {this.props.children}
      </MathObject>
    )
  }

}

// @flow
import * as React from 'react'
import SettingsContainer from './SettingsContainer'
import SettingsContent from './SettingsContent'
import typeof {
  toggleProperty,
  setProperty
} from 'containers/MathObjects/actions'

type Props = {
  title: string,
  parentId: string,
  toggleProperty: toggleProperty,
  setProperty: setProperty,
  data: {type: string}
}

export default class Settings extends React.PureComponent<Props> {

  constructor(props: Props) {
    super(props)
    // $FlowFixMe: https://github.com/facebook/flow/issues/1517
    this.toggleProperty = this.toggleProperty.bind(this)
    // $FlowFixMe: https://github.com/facebook/flow/issues/1517
    this.setProperty = this.setProperty.bind(this)
  }

  toggleProperty(property: string) {
    const { parentId } = this.props
    const { type } = this.props.data
    this.props.toggleProperty(parentId, type, property)
  }

  // TODO: remove explicit any type
  setProperty(property: string, value: any) {
    const { parentId } = this.props
    const { type } = this.props.data
    this.props.setProperty(parentId, type, 'color', value)
  }

  render() {
    return (
      <SettingsContainer title={this.props.title}>
        <SettingsContent
          data={this.props.data}
          parentId={this.props.parentId}
          toggleProperty={this.toggleProperty}
          setProperty={this.setProperty}
        />
      </SettingsContainer>
    )
  }

}

// @flow
import * as React from 'react'
import SettingsContainer from './SettingsContainer'
import SettingsContent from './SettingsContent'
import type { FormRow } from './SettingsContent'
import typeof {
  setProperty
} from 'containers/MathObjects/actions'

// MathObjectData is heavily inexact; missing many props that vary by type
type MathObjectData = {
  type: string
}
export type OwnProps = {|
  title: string,
  parentId: string,
  settingsList: Array<FormRow>
|}
type StateProps = {|
  data: MathObjectData
|}
type DispatchProps = {|
  setProperty: setProperty,
|}
export type Props = {
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
}

export default class Settings extends React.PureComponent<Props> {

  constructor(props: Props) {
    super(props)
    // $FlowFixMe: https://github.com/facebook/flow/issues/1517
    this.setProperty = this.setProperty.bind(this)
  }

  // TODO: remove explicit any type
  setProperty(property: string, value: any) {
    const { parentId } = this.props
    const { type } = this.props.data
    this.props.setProperty(parentId, type, property, value)
  }

  render() {
    return (
      <SettingsContainer title={this.props.title}>
        <SettingsContent
          settingsList={this.props.settingsList}
          data={this.props.data}
          parentId={this.props.parentId}
          setProperty={this.setProperty}
        />
      </SettingsContainer>
    )
  }

}

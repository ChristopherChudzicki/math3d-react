// @flow
import * as React from 'react'
import { Switch } from 'antd'
import { connect } from 'react-redux'
import { setProperty } from 'containers/MathObjects/actions'
import type { ExtractReturn } from 'utils/flow'

type SetProperty = typeof setProperty
// SwitchProps is missing some props
type SwitchProps = {|
  checkedChildren?: string | React.Node,
  unCheckedChildren?: string | React.Node,
  disabled?: boolean,
  size?: 'default' | 'small'
|}
type OwnProps = {|
  field: string,
  disabledField?: string,
  parentId: string,
  // Switch OwnProps
  ...SwitchProps
|}
type StateProps = {|
  checked: boolean,
  type: string
|}
type DispatchProps = {|
  setProperty: SetProperty
|}
type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|}

class _ToggleSwitch extends React.PureComponent<Props> {

  static defaultProps = {
    disabled: false
  }

  onChange: (value: boolean) => ExtractReturn<SetProperty>

  constructor(props: Props) {
    super(props)
    const { parentId, type, field } = props
    this.onChange = this.props.setProperty.bind(this, parentId, type, field)
  }

  render() {
    const { parentId, type, field, disabledField, setProperty, ...otherProps } = this.props
    return (
      <Switch
        onChange={this.onChange}
        {...otherProps}
      />
    )
  }

}

const mapStateToProps = ( { mathGraphics }: any, ownProps: OwnProps) => {
  const { field, parentId, disabledField, disabled, ...otherProps } = ownProps
  const inferDisabled = (typeof disabled === 'boolean')
    ? disabled
    : mathGraphics[parentId][disabledField]

  return ( {
    checked: mathGraphics[parentId][field],
    type: mathGraphics[parentId].type,
    disabled: inferDisabled,
    ...otherProps
  } )
}

const mapDispatchToProps = { setProperty }

export default connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps)(_ToggleSwitch)

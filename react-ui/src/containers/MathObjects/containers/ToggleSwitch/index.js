// @flow
import React, { PureComponent } from 'react'
import { Switch } from 'antd'
import { connect } from 'react-redux'
import { setProperty } from 'containers/MathObjects/actions'
import type { ExtractReturn } from 'utils/flow'

type SetProperty = typeof setProperty
type Props = {
  checked: boolean,
  disabled: boolean,
  field: string,
  disabledField: ?string,
  parentId: string,
  type: string,
  setProperty: SetProperty
}

class ToggleSwitch extends PureComponent<Props> {

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

const mapStateToProps = ( { mathGraphics }, ownProps) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(ToggleSwitch)

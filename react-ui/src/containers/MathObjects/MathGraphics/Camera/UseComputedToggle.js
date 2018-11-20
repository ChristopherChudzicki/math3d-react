// @flow
import React, { PureComponent } from 'react'
import { Switch } from 'antd'
import { connect } from 'react-redux'
import { setProperty } from 'containers/MathObjects/actions'

type Props = {
  checked: boolean,
  parentId: string,
  type: string,
  setProperty: typeof setProperty
}

class _UseComputedToggle extends PureComponent<Props> {

  onChange = (value: boolean) => {
    const { parentId, type } = this.props
    this.props.setProperty(parentId, type, 'isZoomEnabled', !value)
    this.props.setProperty(parentId, type, 'isRotateEnabled', !value)
    this.props.setProperty(parentId, type, 'isPanEnabled', false)
    this.props.setProperty(parentId, type, 'useComputed', value)
  }

  render() {
    const { parentId, type, setProperty, ...otherProps } = this.props
    return (
      <Switch
        onChange={this.onChange}
        {...otherProps}
      />
    )
  }

}

const mapStateToProps = ( { mathGraphics }: any, ownProps: Props) => {
  const { parentId, ...otherProps } = ownProps
  return ( {
    checked: mathGraphics[parentId].useComputed,
    type: mathGraphics[parentId].type,
    ...otherProps
  } )
}

const mapDispatchToProps = { setProperty }

const UseComputedToggle = connect(mapStateToProps, mapDispatchToProps)(_UseComputedToggle)

export default UseComputedToggle

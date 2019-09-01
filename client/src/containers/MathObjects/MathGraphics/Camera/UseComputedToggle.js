// @flow
import * as React from 'react'
import { Switch } from 'antd'
import { connect } from 'react-redux'
import { setProperty } from 'containers/MathObjects/actions'

type OwnProps = {|
  parentId: string,
|}
type StateProps = {|
  checked: boolean,
  type: string
|}
type DispatchProps = {|setProperty: typeof setProperty|}
type Props = {
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
}

class _UseComputedToggle extends React.PureComponent<Props> {

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

const mapStateToProps = ( { mathGraphics }: any, ownProps: OwnProps) => {
  const { parentId, ...otherProps } = ownProps
  return ( {
    checked: mathGraphics[parentId].useComputed,
    type: mathGraphics[parentId].type,
    ...otherProps
  } )
}

const mapDispatchToProps = { setProperty }

export default connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps)(_UseComputedToggle)

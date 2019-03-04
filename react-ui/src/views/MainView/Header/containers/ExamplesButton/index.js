// @flow
import React, { PureComponent } from 'react'
import { Icon } from 'antd'
import { connect } from 'react-redux'
import { openDrawer, closeDrawer } from 'containers/Drawer/actions'

type OwnProps = {||}
type StateProps = {|
  isVisible: boolean,
|}
type DispatchProps = {|
  closeDrawer: (id: string, animationSpeed?: string) => void,
  openDrawer: (id: string, animationSpeed?: string) => void
|}
type Props = {| ...OwnProps, ...StateProps, ...DispatchProps |}

class _ExamplesButton extends PureComponent<Props> {

  onClick = () => {
    if (this.props.isVisible) {
      this.props.closeDrawer('examples')
    }
    else {
      this.props.openDrawer('examples')
    }
  }

  render() {
    return (
      <span onClick={this.onClick}>
        <Icon type="bulb" style={ { paddingRight: '4px' } } />
        Examples
      </span>
    )
  }

}

const mapStateToProps = ( { drawers } ) => ( {
  isVisible: drawers.examples.isVisible
} )

const mapDispatchToProps = {
  openDrawer,
  closeDrawer
}

export default connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps)(_ExamplesButton)

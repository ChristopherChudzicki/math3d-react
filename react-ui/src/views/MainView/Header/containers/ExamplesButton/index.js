// @flow
import React, { PureComponent } from 'react'
import { Button, Icon } from 'antd'
import { connect } from 'react-redux'
import { openDrawer, closeDrawer } from 'containers/Drawer/actions'

type Props = {
  isVisible: boolean,
  closeDrawer: (id: string, animationSpeed?: string) => void,
  openDrawer: (id: string, animationSpeed?: string) => void
}

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
      <Button onClick={this.onClick} size='small'>
        <Icon type="bulb" />
        Examples
      </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(_ExamplesButton)

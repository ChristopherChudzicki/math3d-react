import React, { PureComponent } from 'react'
import SettingsButton from './SettingsButton'
import { Popover } from 'antd'
import PropTypes from 'prop-types'

export default class Settings extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType( [
      PropTypes.string,
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node)
    ] ).isRequired
  }

  state = {
    isVisible: false
  }

  assignContainerRef = (ref) => {
    this.ref = ref
  }

  getContainerRef = () => this.ref

  handleVisibleChange = (isVisible) => {
    this.setState( { isVisible } )
  }

  render() {
    return (
      <div ref={this.assignContainerRef}>
        <Popover
          content={this.props.children}
          title={this.props.title}
          trigger='click'
          placement='right'
          getPopupContainer={this.getContainerRef}
          visible={this.state.isVisible}
          onVisibleChange={this.handleVisibleChange}
        >
          <SettingsButton
            onClick={()=>{console.log("Hello")}}
          />
        </Popover>
      </div>
    )
  }

}

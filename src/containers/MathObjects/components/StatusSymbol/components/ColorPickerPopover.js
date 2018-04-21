import React from 'react'
import PropTypes from 'prop-types'
import { Popover } from 'antd'
import Swatch from './Swatch'

const colors = [
  '#1abc9c',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#8e44ad',
  '#2c3e50',
  '#f1c40f',
  '#e67e22',
  '#e74c3c',
  '#f39c12'
]

export default class ColorPickerPopover extends React.Component {

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onPickColor: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired
  }

  swatch = (
    <Swatch
      colors={colors}
      onPickColor={this.props.onPickColor}
    />
  )

  assignContainerRef = (ref) => {
    this.ref = ref
  }

  getContainerRef = () => this.ref

  render() {
    return (
      <div
        style={{ position: 'relative' }}
        ref={this.assignContainerRef}
      >
        <Popover
          placement='right'
          trigger='none'
          content={this.swatch}
          visible={this.props.visible}
          getPopupContainer={this.getContainerRef}
        >
          {this.props.children}
        </Popover>
      </div>
    )
  }

}

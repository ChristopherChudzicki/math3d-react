// @flow
import * as React from 'react'
import { Popover } from 'antd'
import ColorPicker from './ColorPicker'

type Props = {
  colors?: Array<string>,
  visible: boolean,
  onPickColor: (color: string) => void,
  onHideColorPicker: () => void,
  children: React.Node
}

export default class ColorPickerPopover extends React.Component<Props> {

  ref: ?HTMLElement

  colorPicker = (
    <ColorPicker
      colors={this.props.colors}
      onPickColor={this.props.onPickColor}
    />
  )

  assignContainerRef = (ref: ?HTMLElement) => {
    this.ref = ref
  }

  getContainerRef = () => this.ref

  handleVisibleChange = (visible: boolean) => {
    if (!visible) {
      this.props.onHideColorPicker()
    }
  }

  render() {
    return (
      <div
        style={{ position: 'relative' }}
        ref={this.assignContainerRef}
      >
        <Popover
          placement='right'
          trigger='click'
          content={this.colorPicker}
          visible={this.props.visible}
          onVisibleChange={this.handleVisibleChange}
          getPopupContainer={this.getContainerRef}
        >
          {this.props.children}
        </Popover>
      </div>
    )
  }

}

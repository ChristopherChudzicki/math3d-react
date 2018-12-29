// @flow
import * as React from 'react'
import { Popover, Tabs } from 'antd'
import ColorPicker from './ColorPicker'

const TabPane = Tabs.TabPane

type Props = {
  colors?: Array<string>,
  visible: boolean,
  onPickColor: (color: string) => void,
  onHideColorPicker: () => void,
  children: React.Node,
  extraTabs?: React.Node
}

export default class ColorPickerPopover extends React.Component<Props> {

  ref: ?HTMLElement

  getContent() {
    return this.props.extraTabs
      ? (
        <Tabs>
          <TabPane tab='Colors' key='colors'>
            <ColorPicker
              colors={this.props.colors}
              onPickColor={this.props.onPickColor}
            />
          </TabPane>
          {this.props.extraTabs}
        </Tabs>
      )
      : (
        <ColorPicker
          colors={this.props.colors}
          onPickColor={this.props.onPickColor}
        />
      )
  }

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
          content={this.getContent()}
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

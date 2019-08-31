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

  _containerRef: { current: null | HTMLDivElement }

  constructor(props: Props) {
    super(props)
    this._containerRef = React.createRef()
    // $FlowFixMe
    this.getContainerRef = this.getContainerRef.bind(this)
  }

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

  getContainerRef() {
    // in rare cases, body can be null
    if (document.body === null) {
      throw new Error('document.body is null.')
    }
    // return body as default in case containing div hasn't rendered yet
    return this._containerRef.current || document.body
  }

  handleVisibleChange = (visible: boolean) => {
    if (!visible) {
      this.props.onHideColorPicker()
    }
  }

  render() {
    return (
      <div
        style={{ position: 'relative' }}
        ref={this._containerRef}
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

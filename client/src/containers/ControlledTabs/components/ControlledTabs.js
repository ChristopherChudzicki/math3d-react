// @flow
import * as React from 'react'
import { Tabs } from 'antd'

type Props = {
  id: string,
  setActiveTab: (id: string, activeKey: string) => void
}

export default class ControlledTabs extends React.PureComponent<Props> {

  onChange = (activeKey: string) => {
    this.props.setActiveTab(this.props.id, activeKey)
  }

  render() {
    const { id, ...otherProps } = this.props
    return (
      <Tabs {...otherProps} onChange={this.onChange} />
    )
  }

}

export const TabPane = Tabs.TabPane

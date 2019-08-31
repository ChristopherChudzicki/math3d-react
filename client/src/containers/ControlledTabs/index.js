// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { setActiveTab } from './actions'
import { Tabs } from 'antd'

// TabProps is missing some props
type TabProps = {|
  activeKey: string
|}
type OwnProps = {|
  id: string,
  ...TabProps
|}
type DispatchProps = {|
  setActiveTab: (id: string, activeKey: string) => void
|}
type Props = {
  ...OwnProps,
  ...DispatchProps
}

class _ControlledTabs extends React.PureComponent<Props> {

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

const mapStateToProps = ( { tabs }, ownProps) => ( {
  activeKey: tabs[ownProps.id].activeTab
} )

const mapDispatchToProps = { setActiveTab }

export default connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps)(_ControlledTabs)
export const TabPane = Tabs.TabPane

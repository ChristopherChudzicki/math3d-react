// @flow
import ControlledTabs, { TabPane } from './components/ControlledTabs'
import { connect } from 'react-redux'
import { setActiveTab } from './actions'

const mapStateToProps = ( { tabs }, ownProps) => ( {
  activeKey: tabs[ownProps.id].activeTab
} )

const mapDispatchToProps = { setActiveTab }

export default connect(mapStateToProps, mapDispatchToProps)(ControlledTabs)
export { TabPane }

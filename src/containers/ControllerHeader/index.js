import ControllerHeader from './components/ControllerHeader'
import { connect } from 'react-redux'
import { getActiveFolder } from './selectors'

const mapStateToProps = ( { activeObject, sortableTree } ) => ( {
  activeObject,
  activeFolder: getActiveFolder(sortableTree, activeObject)
} )

const mapDispatchToProps = ( {

} )

export default connect(mapStateToProps, mapDispatchToProps)(ControllerHeader)

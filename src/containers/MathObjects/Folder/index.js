import Folder from './components/Folder'
import { connect } from 'react-redux'
import {
  toggleContentCollapsed
} from './actions'

export const FOLDER = 'FOLDER'

const mapStateToProps = ( { sortableTree, folders, activeObject }, ownProps) => ( {
  itemIds: sortableTree[ownProps.id],
  isCollapsed: folders[ownProps.id].isCollapsed,
  isActive: activeObject === ownProps.id
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onToggleContentCollapsed: () => dispatch(toggleContentCollapsed(ownProps.id))
} )

export default connect(mapStateToProps, mapDispatchToProps)(Folder)

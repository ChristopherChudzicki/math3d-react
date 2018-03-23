import Folder from './components/Folder'
import { connect } from 'react-redux'
import {
  toggleFolderContent,
  setFolderDescription
} from './actions'

export const FOLDER = 'FOLDER'

const mapStateToProps = ( { sortableTree, folders, activeObject }, ownProps) => ( {
  itemIds: sortableTree[ownProps.id],
  description: folders[ownProps.id].description,
  isCollapsed: folders[ownProps.id].isCollapsed,
  isActive: activeObject === ownProps.id
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onToggleContentCollapsed: () => dispatch(toggleFolderContent(ownProps.id)),
  onEditDescription: (value) => dispatch(setFolderDescription(ownProps.id, value))
} )

export default connect(mapStateToProps, mapDispatchToProps)(Folder)

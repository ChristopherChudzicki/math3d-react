import Folder from './components/Folder'
import { connect } from 'react-redux'
import { toggleContentCollapsed } from './actions'

const mapStateToProps = ( { sortableTree, folders }, ownProps) => ( {
  items: sortableTree[ownProps.id],
  title: folders[ownProps.id].title,
  isCollapsed: folders[ownProps.id].isCollapsed
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onToggleContentCollapsed: () => dispatch(toggleContentCollapsed(ownProps.id))
} )

export default connect(mapStateToProps, mapDispatchToProps)(Folder)

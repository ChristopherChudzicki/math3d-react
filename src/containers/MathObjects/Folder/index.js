import Folder from './components/Folder'
import { connect } from 'react-redux'
import { toggleContentCollapsed } from './actions'

const mapStateToProps = ( { sortableTree, folders }, ownProps) => ( {
  items: sortableTree[ownProps.id].map(id => { return { id } } ),
  description: folders[ownProps.id].description,
  isCollapsed: folders[ownProps.id].isCollapsed
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onToggleContentCollapsed: () => dispatch(toggleContentCollapsed(ownProps.id))
} )

export default connect(mapStateToProps, mapDispatchToProps)(Folder)
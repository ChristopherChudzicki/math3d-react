import { connect } from 'react-redux'
import {
  reorderWithinDroppable,
  dragToNewDroppable
} from './actions'
import MathTree from './components/MathTree'

function getItems(itemIds, folders) {
  return itemIds.map(id => ( {
    id,
    isDragDisabled: folders[id].isDragDisabled
  } ))
}

const mapStateToProps = ( { sortableTree, folders } ) => ( {
  items: getItems(sortableTree.root, folders)
} )

const mapDispatchToProps = (dispatch) => ( {
  onDragEnd: (dropResult) => {
    if (!dropResult.destination) {
      return
    }
    else if (dropResult.destination.droppableId === dropResult.source.droppableId) {
      return dispatch(reorderWithinDroppable(dropResult))
    }
    return dispatch(dragToNewDroppable(dropResult))

  }
} )

export default connect(mapStateToProps, mapDispatchToProps)(MathTree)

import { connect } from 'react-redux'
import {
  reorderWithinDroppable,
  dragToNewDroppable
} from './actions'
import MathTree from './components/MathTree'

const mapStateToProps = ( { sortableTree } ) => ( {
  itemIds: sortableTree.root
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

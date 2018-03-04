import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import SortableList from './components/SortableList'
import { connect } from 'react-redux'
import {
  reorderWithinDroppable,
  dragToNewDroppable
} from './actions'
import Folder from './Folder'

function MathTree(props) {
  return (
    <DragDropContext onDragEnd={props.onDragEnd}>
      <SortableList
        // isDropDisabled={true}
        droppableType='FOLDER'
        draggableType='FOLDER'
        droppableId={'root'}
        items={props.items}
        renderItem={
          (item) => (
            <Folder
              id={item}
            />
          )
        }
      />
    </DragDropContext>
  )
}

const mapStateToProps = ( { mathTree }, ownProps) => ( {
  items: mathTree.root.children
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
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

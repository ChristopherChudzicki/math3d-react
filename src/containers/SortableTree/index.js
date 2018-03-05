import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import SortableList from 'components/SortableList'
import { connect } from 'react-redux'
import {
  reorderWithinDroppable,
  dragToNewDroppable
} from './actions'
import Folder from 'containers/MathObjects/Folder'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const SortableListOfFolders = styled(SortableList)`
  width:100%
`

MathTree.propTypes = {
  onDragEnd: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired
}

function MathTree(props) {
  return (
    <DragDropContext onDragEnd={props.onDragEnd}>
      <SortableListOfFolders
        droppableType='FOLDER'
        draggableType='FOLDER'
        droppableId={'root'}
        items={props.items}
        renderItem={item => <Folder id={item} />}
      />
    </DragDropContext>
  )
}

const mapStateToProps = ( { sortableTree }, ownProps) => ( {
  items: sortableTree.root
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

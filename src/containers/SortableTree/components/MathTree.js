import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import SortableList from 'components/SortableList'
import Folder from 'containers/MathObjects/Folder'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const SortableListOfFolders = styled(SortableList)`
  width:100%;
  border-bottom: 1px solid ${props => props.theme.medium};
`

MathTree.propTypes = {
  onDragEnd: PropTypes.func.isRequired,
  itemIds: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default function MathTree(props) {
  return (
    <DragDropContext onDragEnd={props.onDragEnd}>
      <SortableListOfFolders
        droppableType='FOLDER'
        draggableType='FOLDER'
        droppableId={'root'}
        items={props.itemIds.map(id => ( { id } ))}
        renderItem={(item) => <Folder id={item.id} /> }
      />
    </DragDropContext>
  )
}

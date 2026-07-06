import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import SortableList from '../../../components/SortableList'
import Folder from '../../../containers/MathObjects/Folder'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const FolderComponent = Folder.uiComponent

const SortableListOfFolders = styled(SortableList)`
  width:100%;
  border-bottom: 1px solid ${props => props.theme.gray[5]};
`

MathTree.propTypes = {
  onDragEnd: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
}

export default function MathTree(props) {
  return (
    <DragDropContext onDragEnd={props.onDragEnd}>
      <SortableListOfFolders
        droppableType='FOLDER'
        draggableType='FOLDER'
        droppableId={'root'}
        items={props.items}
        renderItem={(item) => <FolderComponent id={item.id} /> }
      />
    </DragDropContext>
  )
}

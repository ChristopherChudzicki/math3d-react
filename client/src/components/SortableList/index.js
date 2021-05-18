import React, { Fragment } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import PartlyDraggable from './PartlyDraggable'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const DraggableItemContainer = styled.div`
  box-shadow: ${props => props.isDragging ? '0 0 5px gray' : ''}
`

const EmptyListIndicator = styled.div`
  text-align: center;
  user-select: none;
  padding: 1em;
`

/**
 * SortableList, React Component
 *
 * A list component with draggable items, constructed with react-beautiful-dnd.
 * Must be placed inside a DragDropContext.
 *
 */

SortableList.propTypes = {
  // array of items to be rendered inisde <Draggable>s
  items: PropTypes.arrayOf(
    PropTypes.shape( {
      id: PropTypes.string.isRequired,
      isDraggable: PropTypes.bool
    } )
  ).isRequired,
  // function to render each item
  renderItem: PropTypes.func.isRequired,
  // Type identifier for droppable and its contained draggables.
  // Draggables can only be dragged to Droppables with same type.
  droppableType: PropTypes.string.isRequired,
  draggableType: PropTypes.string.isRequired,
  // Identifier for the droppable
  droppableId: PropTypes.string.isRequired,
  isDropDisabled: PropTypes.bool,
  // css applied to Droppable's outermost div
  style: PropTypes.object,
  className: PropTypes.string
}

export default function SortableList(props) {
  const { droppableType, draggableType, className, style, renderItem } = props
  return (
    <Droppable
      droppableId={props.droppableId}
      isDropDisabled={props.isDropDisabled}
      type={droppableType}
    >
      {
        // eslint-disable-next-line no-unused-vars
        (provided, snapshot) => (
          <div
            ref={provided.innerRef}
            className={className}
            style={style}
          >
            {props.items.length ? props.items.map((item, index) => (
              renderDraggableItem(
                item,
                renderItem,
                { index, type: draggableType }
              )
            )) : <EmptyListIndicator>Drag an object here to add it to this folder...</EmptyListIndicator>}
            {provided.placeholder}
          </div>
        )
      }
    </Droppable>
  )
}

function renderDraggableItem(item, renderItem, draggableProps) {
  return (
    <PartlyDraggable
      key={item.id}
      draggableId={item.id}
      isDragDisabled={item.isDragDisabled}
      {...draggableProps}
    >
      {(provided, snapshot) => (
        <Fragment>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <DraggableItemContainer isDragging={snapshot.isDragging}>
              {renderItem(item)}
            </DraggableItemContainer>
          </div>
          {provided.placeholder}
        </Fragment>
      )}
    </PartlyDraggable>
  )
}

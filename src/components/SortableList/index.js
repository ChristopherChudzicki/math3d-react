import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'

/**
 * SortableList, React Component
 *
 * A list component with draggable items, constructed with react-beautiful-dnd.
 * Must be placed inside a DragDropContext.
 *
 */

SortableList.propTypes = {
  // array of items to be rendered inisde <Draggable>s
  items: PropTypes.array.isRequired,
  // function to render each item
  renderItem: PropTypes.func.isRequired,
  // Type identifier for droppable and its contained draggables.
  // Draggables can only be dragged to Droppables with same type.
  droppableType: PropTypes.string.isRequired,
  draggableType: PropTypes.string.isRequired,
  // Identifier for the droppable
  droppableId: PropTypes.string.isRequired,
  // css applied to Droppable's outermost div
  style: PropTypes.object,
  className: PropTypes.string
}

export default function SortableList(props) {
  const { droppableType, draggableType, className, style, renderItem } = props
  return (
    <Droppable
      droppableId={props.droppableId}
      type={droppableType}
    >
      {
        (provided, snapshot) => (
          <div
            ref={provided.innerRef}
            // TODO: conditionally add a class .isDraggingOver
            className={className}
            style={style}
          >
            {props.items.map((item, index) => (
              renderDraggableItem(item, index, renderItem, draggableType)
            ))}
            {provided.placeholder}
          </div>
        )
      }
    </Droppable>
  )
}

function renderDraggableItem(item, index, renderItem, draggableType) {
  return (
    <Draggable key={item} draggableId={item} index={index} type={draggableType}>
      {(provided, snapshot) => (
        <div>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {renderItem(item)}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Draggable>
  )
}

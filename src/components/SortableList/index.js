import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'

SortableList.propTypes = {
  droppableId: PropTypes.string.isRequired,
  className: PropTypes.string,
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  style: PropTypes.object
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

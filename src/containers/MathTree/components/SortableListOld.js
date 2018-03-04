import React, { Component } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

// fake data generator
const getItems = count =>
  Array.from( { length: count }, (v, k) => k).map(k => ( {
    id: `item-${k}`,
    content: `item ${k}`
  } ))

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ( {
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
} )

const getListStyle = isDraggingOver => ( {
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: '100%'
} )

class SortableList extends Component {

  state = {
    items: getItems(10)
  };

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    console.log(result)

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    )

    this.setState( {
      items
    } )
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided, snapshot) => (
            <div
              ref={droppableProvided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(draggableProvided, snapshot) => (
                    <div>
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          draggableProvided.draggableProps.style
                        )}
                      >
                        {item.content}
                      </div>
                      {draggableProvided.placeholder}
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }

}

export default SortableList

import {
  REORDER_WITHIN_DROPPABLE,
  DRAG_TO_NEW_DROPPABLE
}
  from './actions'
import update from 'immutability-helper'

export function reOrder(list, sourceIndex, destinationIndex) {
  const result = [...list]
  const [removed] = result.splice(sourceIndex, 1)
  result.splice(destinationIndex, 0, removed)
  return result
}

update.extend('$reOrder', (sourceDestIndexes, list) => (
  reOrder(list, ...sourceDestIndexes)
))

const initialState = {
  root: []
}

export default (state = initialState, { type, payload } ) => {
  switch (type) {

    case REORDER_WITHIN_DROPPABLE: {

      const { source, destination } = payload
      return update(state,
        {
          [source.droppableId]: { $reOrder: [source.index, destination.index] }
        } )

    }

    case DRAG_TO_NEW_DROPPABLE: {

      const { source, destination, draggableId } = payload
      return update(state,
        {
          [source.droppableId]: { $splice: [[source.index, 1]] },
          [destination.droppableId]: { $splice: [[destination.index, 0, draggableId]] }
        } )

    }

    default:
      return state

  }
}

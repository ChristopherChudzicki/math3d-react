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
  root: {
    title: 'root',
    children: ['folder0', 'folder1', 'folder2', 'folder3']
  },
  folder0: {
    title: 'Folder 0',
    children: ['item0-0', 'item0-1', 'item0-2', 'item0-3']
  },
  folder1: {
    title: 'Folder 1',
    children: ['item1-0', 'item1-1', 'item1-2']
  },
  folder2: {
    title: 'Folder 1',
    children: ['item2-0', 'item2-1', 'item2-2', 'item2-3', 'item2-4']
  },
  folder3: {
    title: 'Folder 1',
    children: ['item3-0', 'item3-1', 'item3-2', 'item3-3']
  }
}

export default (state = initialState, { type, payload } ) => {
  switch (type) {

    case REORDER_WITHIN_DROPPABLE: {

      const { source, destination } = payload
      return update(state,
        {
          [source.droppableId]: {
            children: {
              $reOrder: [source.index, destination.index]
            }
          }
        } )

    }

    case DRAG_TO_NEW_DROPPABLE: {

      const { source, destination, draggableId } = payload
      return update(state,
        {
          [source.droppableId]: {
            children: {
              $splice: [[source.index, 1]]
            }
          },
          [destination.droppableId]: {
            children: {
              $splice: [[destination.index, 0, draggableId]]
            }
          }
        } )

    }

    default:
      return state

  }
}

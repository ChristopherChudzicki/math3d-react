export const EDIT_FOLDER_TITLE = 'EDIT_FOLDER_TITLE'
export const ADD_FOLDER = 'ADD_FOLDER'
export const ADD_FOLDER_ITEM = 'ADD_FOLDER_ITEM'
export const DRAG_TO_NEW_DROPPABLE = 'DRAG_TO_NEW_DROPPABLE'
export const REORDER_WITHIN_DROPPABLE = 'REORDER_WITHIN_DROPPABLE'

/**
 * action creator for reordering draggables. The argument object is essentially
 * a react-beautiful-dnd DropResult object.
 *
 * @param  {object} source      [description]
 * @param  {string} source.droppableId
 * @param  {number} source.index position in source list
 * @param  {object} destination [description]
 * @param  {string} destination.droppableId
 * @param  {number} destination.index position in destination list
 * @param  {string} draggableId
 */
export const dragToNewDroppable = ( { source, destination, draggableId } ) => ( {
  type: DRAG_TO_NEW_DROPPABLE,
  payload: {
    source,
    destination,
    draggableId
  }
} )

export const reorderWithinDroppable = ( { source, destination, draggableId } ) => ( {
  type: REORDER_WITHIN_DROPPABLE,
  payload: {
    source,
    destination,
    draggableId
  }
} )

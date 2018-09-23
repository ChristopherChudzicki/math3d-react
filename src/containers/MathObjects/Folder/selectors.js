import {
  AXIS,
  GRID
} from 'containers/MathObjects/MathGraphics'
import createCachedSelector from 're-reselect'
function getType(mathGraphics, mathSymbols, id) {
  if (mathGraphics[id] ) {
    return mathGraphics[id].type
  }
  else if (mathSymbols[id] ) {
    return mathSymbols[id].type
  }
  else {
    throw Error(`Folder child item ${id} is not a mathGraphic or mathSymbols variable`)
  }
}

const DRAG_DISABLED = new Set( [AXIS, GRID] )

export const getItems = createCachedSelector(
  (state, folderId) => state.mathGraphics,
  (state, folderId) => state.mathSymbols,
  (state, folderId) => state.sortableTree[folderId], // itemIds
  (mathGraphics, mathSymbols, itemIds) => itemIds.map(
    id => {
      const type = getType(mathGraphics, mathSymbols, id)
      return { id, type, isDragDisabled: DRAG_DISABLED.has(type) }
    }
  )
)(
  (state, folderId) => folderId
)

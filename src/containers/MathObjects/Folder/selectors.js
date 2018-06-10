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

export const getItems = createCachedSelector(
  (state, folderId) => state.mathGraphics,
  (state, folderId) => state.mathSymbols,
  (state, folderId) => state.sortableTree[folderId], // itemIds
  (mathGraphics, mathSymbols, itemIds) => itemIds.map(
    id => ( { id, type: getType(mathGraphics, mathSymbols, id) } )
  )
)(
  (state, folderId) => folderId
)

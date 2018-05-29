function getType(state, id) {
  if (state.mathGraphics[id] ) {
    return state.mathGraphics[id].type
  }
  else if (state.mathSymbols[id] ) {
    return state.mathSymbols[id].type
  }
  else {
    throw Error(`Folder child item ${id} is not a mathGraphic or mathSymbols variable`)
  }
}

export function getItems(state, folderId) {
  const itemIds = state.sortableTree[folderId]
  return itemIds.map(id => ( { id, type: getType(state, id) } )
  )
}

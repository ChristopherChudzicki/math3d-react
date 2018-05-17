function getType(state, id) {
  if (state.mathGraphics[id] ) {
    return state.mathGraphics[id].type
  }
  else if (state.mathScope[id] ) {
    return state.mathScope[id].type
  }
  else {
    throw Error(`Folder child item ${id} is not a mathGraphic or mathScope variable`)
  }
}

export function getItems(state, folderId) {
  const itemIds = state.sortableTree[folderId]
  return itemIds.map(id => ( { id, type: getType(state, id) } )
  )
}

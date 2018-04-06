import { uniqueId } from 'lodash'
import { initialState as drawerInitialState } from './containers/Drawer/reducer'

function getRandomInt(a, b) {
  const range = b - a + 1
  return Math.floor(a + Math.random() * Math.floor(range))
}

function addFolder(store) {
  const id = `folder-${uniqueId()}`
  store.sortableTree.root.push(id)
  store.sortableTree[id] = []
  store.folders[id] = {
    isCollapsed: Math.random() > 0.5
  }
  store.descriptions[id] = `Folder ${id}`

  return id
}

function addPoint(store, folderId) {
  const itemId = `item-${uniqueId()}`
  store.sortableTree[folderId].push(itemId)
  store.points[itemId] = { coords: '\\left[0,0,0\\right]' }
  store.descriptions[itemId] = `Point ${itemId}`
}

export function makeMockStore() {
  const store = {
    drawers: drawerInitialState,
    sortableTree: {
      root: []
    },
    folders: {},
    points: {},
    descriptions: {}
  }

  for (let j = 0; j < 5; j++) {
    const folderId = addFolder(store)
    const kMax = getRandomInt(4, 12)
    for (let k = 0; k < kMax; k++) {
      addPoint(store, folderId)
    }
  }

  return store

}

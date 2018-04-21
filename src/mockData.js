import { uniqueId } from 'lodash'
import { initialState as drawerInitialState } from './containers/Drawer/reducer'

function getRandomInt(a, b) {
  const range = b - a + 1
  return Math.floor(a + Math.random() * Math.floor(range))
}

const colors = [
  '#1abc9c',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#8e44ad',
  '#2c3e50',
  '#f1c40f',
  '#e67e22',
  '#e74c3c',
  '#f39c12'
]

function addFolder(store) {
  const id = `folder-${uniqueId()}`
  store.sortableTree.root.push(id)
  store.sortableTree[id] = []
  store.folders[id] = {
    description: 'Folder',
    isCollapsed: Math.random() > 0.5
  }

  return id
}

function addPoint(store, folderId) {
  const itemId = `item-${uniqueId()}`
  store.sortableTree[folderId].push(itemId)
  store.points[itemId] = {
    description: 'Point',
    coords: '\\left[0,\\ 0,\\ 0\\right]',
    visible: true,
    color: colors[getRandomInt(0, colors.length - 1)]
  }
}

export function makeMockStore() {
  const store = {
    drawers: drawerInitialState,
    sortableTree: {
      root: []
    },
    folders: {},
    points: {}
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

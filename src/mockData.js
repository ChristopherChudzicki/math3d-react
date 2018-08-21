import { uniqueId } from 'lodash'
import { initialState as drawerInitialState } from './containers/Drawer/reducer'
import {
  POINT,
  FOLDER,
  VARIABLE,
  VARIABLE_SLIDER
} from 'containers/MathObjects/mathObjectTypes'

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
    tyoe: FOLDER,
    description: 'Folder',
    isCollapsed: Math.random() > 0.5
  }

  return id
}

function randomInt(a=-5, b=5) {
  return a + Math.floor(Math.random() * (b - a))
}

function addPoint(store, folderId) {
  const itemId = `item-${uniqueId()}`
  store.parseErrors[itemId] = {}
  store.evalErrors[itemId] = {}
  store.sortableTree[folderId].push(itemId)
  store.mathGraphics[itemId] = {
    type: POINT,
    description: 'Point',
    coords: `\\left[${randomInt()},\\ ${randomInt()},\\ ${randomInt()}\\right]`,
    visible: true,
    color: colors[getRandomInt(0, colors.length - 1)],
    size: randomInt(12, 48)
  }
}

export function makeMockStore() {
  const store = {
    drawers: drawerInitialState,
    sortableTree: {
      root: ['vars'],
      vars: ['var0', 'var1', 'var2', 'var3']
    },
    folders: {
      'vars': {
        description: 'Some Variables',
        isCollapsed: false
      }
    },
    mathGraphics: {},
    mathSymbols: {
      var0: {
        type: VARIABLE,
        description: 'A variable',
        name: 'f\\left(x\\right)',
        value: 'e^x\\ +\\ \\frac{1}{2}'
      },
      var1: {
        type: VARIABLE,
        description: 'Another variable',
        name: 'a',
        value: '2'
      },
      var2: {
        type: VARIABLE,
        description: 'One more variable',
        name: 'b',
        value: '\\left[-2,1,4\\right]'
      },
      var3: {
        type: VARIABLE_SLIDER,
        description: 'A slider!',
        name: 'T',
        value: null,
        min: '-\\pi',
        max: '2\\pi'
      }
    },
    parseErrors: {
      var0: {},
      var1: {},
      var2: {},
      var3: {}
    },
    evalErrors: {
      var0: {},
      var1: {},
      var2: {},
      var3: {}
    },
    sliderValues: {
      var3: 7.3
    }
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

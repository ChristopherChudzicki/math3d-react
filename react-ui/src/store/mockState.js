// @flow
// NOTE: This is just for tinkering and testing ...
import { uniqueId } from 'lodash'
import store from './index'
import { createMathObject } from 'containers/MathObjects/actions'
import {
  FOLDER,
  VARIABLE,
  VARIABLE_SLIDER,
  AXIS,
  GRID,
  POINT,
  LINE,
  VECTOR,
  PARAMETRIC_CURVE,
  IMPLICIT_SURFACE
} from 'containers/MathObjects'

// folders 'axes' and 'mainFolder' already exist from initialState
store.dispatch(
  createMathObject('vars', FOLDER, 'root', 2, { description: 'Some Variables' } )
)
store.dispatch(
  createMathObject('folder1', FOLDER, 'root', 3, { description: 'Folder 1' } )
)
store.dispatch(
  createMathObject('folder2', FOLDER, 'root', 4, { description: 'Folder 2', isCollapsed: true } )
)
store.dispatch(
  createMathObject('folder3', FOLDER, 'root', 5, { description: 'Folder 3' } )
)

function randomElement<T>(items: Array<T>): T {
  // https://stackoverflow.com/a/5915122/2747370
  return items[Math.floor(Math.random()*items.length)]
}

function randomInt(a=-5, b=5) {
  return a + Math.floor(Math.random() * (b - a))
}
function randomReal(a=0, b=1) {
  return a + Math.random() * (b - a)
}

function randomRealString(a=0, b=1) {
  return randomReal(a, b).toFixed(1)
}

function randomColor() {
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
  return randomElement(colors)
}

function randomTexTriple(a=-5, b=5) {
  return `\\left[${randomInt(a, b)},\\ ${randomInt(a, b)},\\ ${randomInt(a, b)}\\right]`
}

function randomTexList(n=2, a=-5, b=5) {
  const triples = []
  for (let j = 0; j < n; j++) {
    triples.push(randomTexTriple(a, b))
  }
  return `\\left[${triples.join(',\\ ')}\\right]`
}

// Make some variables
const folders = ['folder1', 'folder2', 'folder3']
function createObject(settings: {
  type: string,
  folder?: string,
  [string]: any
} ) {
  const { type, folder, ...otherSettings } = settings
  const parentFolder = folder || randomElement(folders)
  const insertAt = store.getState().sortableTree[parentFolder].length
  store.dispatch(
    createMathObject(uniqueId(), type, parentFolder, insertAt, otherSettings)
  )
}

const randomPoint = () => ( {
  type: POINT,
  color: randomColor(),
  coords: randomTexTriple(),
  size: randomRealString(12, 48)
} )
const randomLine = () => ( {
  type: LINE,
  color: randomColor(),
  coords: randomTexList(2),
  width: randomRealString(2, 8),
  size: randomRealString(12, 48)
} )
const randomVector = () => ( {
  type: VECTOR,
  color: randomColor(),
  components: randomTexTriple(),
  tail: randomTexTriple(),
  width: randomRealString(2, 8),
  size: randomRealString(4, 10)
} )

const varsList = [
  {
    type: VARIABLE,
    folder: 'vars',
    description: 'A variable',
    name: 'f\\left(x\\right)',
    value: 'e^x\\ +\\ \\frac{1}{2}'
  },
  {
    type: VARIABLE,
    folder: 'vars',
    description: 'Another variable',
    name: 'a',
    value: '2'
  },
  {
    type: VARIABLE,
    folder: 'vars',
    description: 'One more variable',
    name: 'b',
    value: '\\left[-2,1+,4\\right]'
  },
  {
    type: VARIABLE_SLIDER,
    folder: 'vars',
    description: 'A slider!',
    name: 'T',
    value: null,
    min: '-\\pi',
    max: '2\\pi'
  }
]

const settingsList = [
  {
    type: IMPLICIT_SURFACE,
    folder: 'mainFolder'
  },
  {
    type: PARAMETRIC_CURVE,
    folder: 'mainFolder'
  },
  ...varsList,
  randomLine(), randomLine(),
  randomVector(), randomVector(), randomVector()
]

for (let j = 0; j < 10; j++) {
  settingsList.push(randomPoint())
}

for (const obj of settingsList) {
  createObject(obj)
}

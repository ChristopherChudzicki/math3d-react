import MathObjects, { FOLDER, VARIABLE_SLIDER } from 'containers/MathObjects'
import idGenerator from 'constants/idGenerator'

// difference in obj1 and obj2
// ASSUMING obj1 keys are superset of obj2
// GOAL: { ...obj2, ...simpleDiff(obj1, obj2) } == obj1
function simpleDiff(obj1, obj2, keep = new Set()) {
  return Object.keys(obj1).reduce((acc, key) => {
    if (obj1[key] !== obj2[key] || keep.has(key)) {
      acc[key] = obj1[key]
    }
    return acc
  }, {} )
}

/**
 * Take current state and:
 *  - drop drawers
 *  - drop activeObject
 *  - save sortableTree directly
 *
 * Now deal with MathObjects (foldres, mathSymbols, mathGraphics)
 *  - diff each MathObject settings with defaultSettings
 *  - for each of [pareErrors, evalErrors, renderErrors]:
 *    diff each entry with defaults, {}
 *    remove if entry = default
 *  - save sliderValues
 */
export function dehydrate(state) {
  const {
    metadata,
    sortableTree,
    folders,
    mathSymbols,
    mathGraphics
  } = state

  const startingPoint = {
    metadata,
    sortableTree,
    folders: {},
    mathSymbols: {},
    mathGraphics: {}
  }

  const keep = new Set( ['type'] )

  const withFolders = Object.keys(folders).reduce((acc, key) => {
    const item = folders[key]
    acc.folders[key] = simpleDiff(item, MathObjects[FOLDER].defaultSettings, keep)
    return acc
  }, startingPoint)

  const withSymbols = Object.keys(mathSymbols).reduce((acc, key) => {
    const item = mathSymbols[key]
    acc.mathSymbols[key] = simpleDiff(item, MathObjects[item.type].defaultSettings, keep)
    return acc
  }, withFolders)

  const withGraphics = Object.keys(mathGraphics).reduce((acc, key) => {
    const item = mathGraphics[key]
    acc.mathGraphics[key] = simpleDiff(item, MathObjects[item.type].defaultSettings, keep)
    return acc
  }, withSymbols)

  return withGraphics

}

export function rehydrate(dehydrated) {
  const {
    metadata,
    sortableTree,
    folders,
    mathSymbols,
    mathGraphics
  } = dehydrated

  const startingPoint = {
    metadata,
    sortableTree,
    sliderValues: {},
    folders: {},
    mathSymbols: {},
    mathGraphics: {},
    parseErrors: {},
    evalErrors: {},
    renderErrors: {}
  }

  const withFolders = Object.keys(folders).reduce((acc, key) => {
    const item = folders[key]
    acc.folders[key] = { ...MathObjects[FOLDER].defaultSettings, ...item }
    return acc
  }, startingPoint)

  const withSymbols = Object.keys(mathSymbols).reduce((acc, key) => {
    const item = mathSymbols[key]
    acc.mathSymbols[key] = { ...MathObjects[item.type].defaultSettings, ...item }
    if (item.type === VARIABLE_SLIDER) {
      acc.sliderValues[key] = 0
    }
    acc.parseErrors[key] = {}
    acc.evalErrors[key] = {}
    acc.renderErrors[key] = {}
    return acc
  }, withFolders)

  const withGraphics = Object.keys(mathGraphics).reduce((acc, key) => {
    const item = mathGraphics[key]
    acc.mathGraphics[key] = { ...MathObjects[item.type].defaultSettings, ...item }
    acc.parseErrors[key] = {}
    acc.evalErrors[key] = {}
    acc.renderErrors[key] = {}
    return acc
  }, withSymbols)

  const maxId = getMaxId(sortableTree)
  idGenerator.setNextId(maxId + 1)

  return withGraphics

}

function getMaxId(sortableTree) {
  let maxId = 0
  sortableTree.root.forEach(folderId => {
    sortableTree[folderId].forEach(id => {
      const asNumber = parseInt(id, 10)
      if (asNumber > maxId) {
        maxId = asNumber
      }
    } )
  } )

  return maxId
}

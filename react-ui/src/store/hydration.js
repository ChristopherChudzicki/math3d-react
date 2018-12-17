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
 *  Diff each mathObject in subStore with the item-level defaults
 *
 * @param  {[type]} subStore either mathGraphics, mathSymbols, or folders
 * @return {[type]}          subStore where each item has been diff'd with
 * item-level defaults
 */
function dehydrateMathObjects(subStore, type=null) {
  const keep = new Set( ['type'] )
  return Object.keys(subStore).reduce((acc, key) => {
    const item = subStore[key]
    const itemType = type || item.type
    acc[key] = simpleDiff(item, MathObjects[itemType].defaultSettings, keep)
    return acc
  }, {} )
}

function rehydrateMathObjects(dehydrated, type=null) {
  return Object.keys(dehydrated).reduce((acc, key) => {
    const item = dehydrated[key]
    const itemType = type || item.type
    acc[key] = { ...MathObjects[itemType].defaultSettings, ...item }
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

  const dehydrated = {
    metadata,
    sortableTree,
    folders: dehydrateMathObjects(folders, FOLDER),
    mathSymbols: dehydrateMathObjects(mathSymbols),
    mathGraphics: dehydrateMathObjects(mathGraphics)
  }

  return dehydrated

}

export function rehydrate(dehydrated) {
  const {
    metadata,
    sortableTree,
    folders,
    mathSymbols,
    mathGraphics
  } = dehydrated

  const rehydratedFolders = rehydrateMathObjects(folders, FOLDER)
  const rehydratedSymbols = rehydrateMathObjects(mathSymbols)
  const rehydratedGraphics = rehydrateMathObjects(mathGraphics)

  const rehydrated = {
    metadata,
    sortableTree,
    sliderValues: {},
    folders: rehydratedFolders,
    mathSymbols: rehydratedSymbols,
    mathGraphics: rehydratedGraphics,
    parseErrors: {},
    evalErrors: {},
    renderErrors: {}
  }

  Object.keys(mathGraphics).concat(Object.keys(mathSymbols)).forEach(key => {
    rehydrated.parseErrors[key] = {}
    rehydrated.evalErrors[key] = {}
    rehydrated.renderErrors[key] = {}
  } )

  const maxId = getMaxId(sortableTree)
  idGenerator.setNextId(maxId + 1)

  return rehydrated

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

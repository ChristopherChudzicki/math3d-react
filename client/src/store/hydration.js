import MathObjects, { FOLDER } from 'containers/MathObjects'
import idGenerator from 'constants/idGenerator'
import initialState, { sortableTreeFixedPortion } from './initialState'
import { initialState as metadataInitial } from 'services/metadata/reducer'

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

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
 *  Diff each mathObject in subStore with its initail value. For items that
 *  exist in initialState, initialValue is taken from initialState. For new
 *  items, initialValue means defaultValue.
 *
 * @param  {object} subStore either mathGraphics, mathSymbols, or folders
 * @param  {object} initialStore initialState of the substore
 * @param  {boolean} isFolders whether the subStore is folders
 * @param  {[type]} subStore either mathGraphics, mathSymbols, or folders
 * @return {[type]}          subStore where each item has been diff'd with
 * item-level defaults
 */
function dehydrateMathObjects(subStore, initialStore, isFolders=false) {
  const keep = new Set( ['type'] )
  return Object.keys(subStore).reduce((acc, key) => {
    const item = subStore[key]
    const itemType = isFolders ? FOLDER : item.type
    const defaultSettings = MathObjects[itemType].defaultSettings
    const diffAgainst = initialStore[key]
      ? { ...defaultSettings, ...initialStore[key] }
      : defaultSettings
    const diff = simpleDiff(item, diffAgainst, keep)

    const differsFromInitial = isFolders
      ? Object.keys(diff).length > 0
      : Object.keys(diff).length > 1
    if (initialStore[key] === undefined || differsFromInitial) {
      acc[key] = diff
    }

    return acc
  }, {} )
}

function rehydrateMathObjects(dehydrated, initialStore, isFolders=false) {
  const withInitial = { ...initialStore, ...dehydrated }
  return Object.keys(withInitial).reduce((acc, key) => {
    const item = withInitial[key]
    const itemType = isFolders ? FOLDER : item.type
    const defaultSettings = MathObjects[itemType].defaultSettings
    const diffAgainst = initialStore[key]
      ? { ...defaultSettings, ...initialStore[key] }
      : defaultSettings
    acc[key] = { ...diffAgainst, ...item }
    return acc
  }, {} )
}

function dehydrateFolders(folders, initialFolders) {
  const partial = dehydrateMathObjects(folders, initialState.folders, true)
  return Object.fromEntries(
    Object.entries(partial).filter(([key, value]) => !isEmpty(value))
  )
}

function rehydrateFolders(sortableTree, folders, initialFolders) {
  const { root } = sortableTree
  const emptyFolders = Object.fromEntries(root.map(id => [id, {}]))
  const toRehydrate = { ...emptyFolders, ...folders }
  return rehydrateMathObjects(toRehydrate, initialState.folders, true)
}

/**
 * Take current state and:
 *  - drop drawers
 *  - drop activeObject
 *  - drop fixed portion from sortableTree
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
    mathGraphics,
    sliderValues
  } = state

  const sortableTreeWithoutFixed = Object.keys(sortableTree).reduce((acc, key) => {
    if (sortableTreeFixedPortion[key] === undefined) {
      acc[key] = sortableTree[key]
    }
    return acc
  }, { } )

  const keepMeta = new Set( ['versionAtCreation'] )
  const dehydrated = {
    metadata: simpleDiff(metadata, metadataInitial, keepMeta),
    sortableTree: sortableTreeWithoutFixed,
    folders: dehydrateFolders(folders, initialState.folders),
    mathSymbols: dehydrateMathObjects(mathSymbols, initialState.mathSymbols),
    mathGraphics: dehydrateMathObjects(mathGraphics, initialState.mathGraphics),
    sliderValues
  }

  const withoutEmpty = Object.fromEntries(
    Object.entries(dehydrated).filter(([key, value]) => !isEmpty(value))
  )

  return withoutEmpty

}

export function rehydrate(dehydrated) {
  const {
    metadata,
    sortableTree: sortableTreeWithoutFixed,
    folders,
    mathSymbols,
    mathGraphics,
    sliderValues
  } = dehydrated

  const sortableTree = { ...sortableTreeFixedPortion, ...sortableTreeWithoutFixed }
  const rehydratedFolders = rehydrateFolders(sortableTree, folders, initialState.folders)
  const rehydratedSymbols = rehydrateMathObjects(mathSymbols, initialState.mathSymbols)
  const rehydratedGraphics = rehydrateMathObjects(mathGraphics, initialState.mathGraphics)

  const rehydrated = {
    activeObject: null,
    metadata: { ...metadataInitial, ...metadata },
    sortableTree,
    sliderValues,
    folders: rehydratedFolders,
    mathSymbols: rehydratedSymbols,
    mathGraphics: rehydratedGraphics,
    parseErrors: {}, // populated below
    evalErrors: {}, // populated below
    renderErrors: {} // populated below
  }

  // Add in the error-holders
  Object.keys(rehydratedSymbols)
    .concat(Object.keys(rehydratedGraphics)).forEach(key => {
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
    const folderIdasNumber = parseInt(folderId, 10)
    if (folderIdasNumber > maxId) {
      maxId = folderIdasNumber
    }
    sortableTree[folderId].forEach(id => {
      const asNumber = parseInt(id, 10)
      if (asNumber > maxId) {
        maxId = asNumber
      }
    } )
  } )

  return maxId
}

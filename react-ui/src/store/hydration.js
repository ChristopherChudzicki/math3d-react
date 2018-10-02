import MathObjects, { FOLDER } from 'containers/MathObjects'

window.simpleDiff = simpleDiff

function isEmpty(obj) {
  // https://stackoverflow.com/a/32108184/2747370
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

// difference in obj1 and obj2
// ASSUMING obj1 keys are superset of obj2
// GOAL: { ...obj2, ...simpleDiff(obj1, obj2) } == obj1
function simpleDiff(obj1, obj2, keep = new Set()) {
  return Object.keys(obj1).reduce((acc, key) => {
    if (obj1[key] !== obj2[key] || keep.has(key) ) {
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
    sortableTree,
    sliderValues,
    folders,
    mathSymbols,
    mathGraphics,
    parseErrors,
    evalErrors,
    renderErrors
  } = state

  const startingPoint = {
    sortableTree,
    sliderValues,
    folders: {},
    mathSymbols: {},
    mathGraphics: {},
    parseErrors: {},
    evalErrors: {},
    renderErrors: {}
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
    acc.parseErrors[key] = simpleDiff(parseErrors[key], {} )
    acc.evalErrors[key] = simpleDiff(evalErrors[key], {} )
    acc.renderErrors[key] = simpleDiff(renderErrors[key], {} )
    return acc
  }, withFolders)

  const withGraphics = Object.keys(mathGraphics).reduce((acc, key) => {
    const item = mathGraphics[key]
    acc.mathGraphics[key] = simpleDiff(item, MathObjects[item.type].defaultSettings, keep)
    acc.parseErrors[key] = simpleDiff(parseErrors[key], {} )
    acc.evalErrors[key] = simpleDiff(evalErrors[key], {} )
    acc.renderErrors[key] = simpleDiff(renderErrors[key], {} )
    return acc
  }, withSymbols)

  const errTypes = ['parseErrors', 'evalErrors', 'renderErrors']
  const withoutEmptyErrors = errTypes.reduce((acc, errType) => {
    for (const key of Object.keys(acc[errType] )) {
      if (isEmpty(acc[errType][key] )) {
        delete acc[errType][key]
      }
    }
    return acc
  }, withGraphics)

  return withoutEmptyErrors

}

export function rehydrate(dehydrated) {
  const {
    sortableTree,
    sliderValues,
    folders,
    mathSymbols,
    mathGraphics,
    parseErrors,
    evalErrors,
    renderErrors
  } = dehydrated

  const startingPoint = {
    sortableTree,
    sliderValues,
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
    acc.parseErrors[key] = parseErrors[key] || {}
    acc.evalErrors[key] = evalErrors[key] || {}
    acc.renderErrors[key] = renderErrors[key] || {}
    return acc
  }, withFolders)

  const withGraphics = Object.keys(mathGraphics).reduce((acc, key) => {
    const item = mathGraphics[key]
    acc.mathGraphics[key] = { ...MathObjects[item.type].defaultSettings, ...item }
    acc.parseErrors[key] = parseErrors[key] || {}
    acc.evalErrors[key] = evalErrors[key] || {}
    acc.renderErrors[key] = renderErrors[key] || {}
    return acc
  }, withSymbols)

  return withGraphics

}

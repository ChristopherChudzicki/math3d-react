import createCachedSelector from 're-reselect'

export function getMathObjectProp(objectsArray, id, propName) {
  for (const obj of objectsArray) {
    if (obj[id] ) {
      return obj[id][propName]
    }
  }
  throw Error(`id ${id} not found in ${objectsArray}`)
}

/**
 * Given an object mapping id to name, get set of all names except name
 * corresponding to omittedId
 *
 * @param  {Parser} parser instance
 * @param  {object} mathSymbols
 * @param  {string} mathSymbols[id]
 * @param  {string} omittedId id to omit
 * @returns {set} of names
 */
export function calculateUsedNames(parser, mathSymbols, omittedId) {
  return new Set(Object.keys(mathSymbols).filter(
    id => id !== omittedId
  ).map(
    id => {
      try { return parser.parse(mathSymbols[id].name).name }
      catch (err) { return null }
    }
  ).filter(name => name !== null))
}

/**
 * getUsedSymbols: a memoized selector, returns set of symbols used as names in
 * mathObjects, but omitting id of object with id omittedId
 * @param {Parser} parser instance
 * @param {object} mathSymbols
 * @param {string} mathSymbols[id]
 * @param {string} id id of mathObject to omit
 * @returns {Set}
 */
export const getUsedNames = createCachedSelector(
  (parser, mathSymbols, omittedId) => parser,
  (parser, mathSymbols, omittedId) => mathSymbols,
  (parser, mathSymbols, omittedId) => omittedId,
  (parser, mathSymbols, omittedId) => calculateUsedNames(parser, mathSymbols, omittedId)
)(
  (parser, mathSymbols, omittedId) => omittedId
)

export const getValidateNameAgainst = createCachedSelector(
  (parser, mathSymbols, id) => parser,
  (parser, mathSymbols, id) => mathSymbols,
  (parser, mathSymbols, id) => id,
  (parser, mathSymbols, id) => ( {
    usedNames: getUsedNames(parser, mathSymbols, id),
    latexRHS: mathSymbols[id].value
  } )
)(
  (parser, mathSymbols, id) => id
)

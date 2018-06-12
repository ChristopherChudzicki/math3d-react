import createCachedSelector from 're-reselect'
import {
  isValidName,
  isAssignmentLHS
} from 'containers/MathObjects/components/MathInput'

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
export function calculateUsedSymbols(parser, mathSymbols, omittedId) {
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
export const getUsedSymbols = createCachedSelector(
  (parser, mathSymbols, omittedId) => parser,
  (parser, mathSymbols, omittedId) => mathSymbols,
  (parser, mathSymbols, omittedId) => omittedId,
  (parser, mathSymbols, omittedId) => calculateUsedSymbols(parser, mathSymbols, omittedId)
)(
  (parser, mathSymbols, omittedId) => omittedId
)

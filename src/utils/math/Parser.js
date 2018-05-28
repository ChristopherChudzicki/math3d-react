import MathExpression from './MathExpression'
import { preprocessHOFs, preprocessMathQuill } from './preprocessors'
import { reassignOperators } from './postprocessors'
import { setMergeInto } from 'utils/sets'

export default class Parser {

  _cache = {}
  _preprocessors = []
  _postprocessors = []

  static _defaultPreprocessors = [
    preprocessMathQuill,
    preprocessHOFs( ['diff', 'unitT', 'unitN', 'unitB'] )
  ]
  static _defaultPostprocessors = [
    reassignOperators( { '|': 'dot', '&': 'cross' } )
  ]

  constructor(
    preprocessors = Parser._defaultPreprocessors,
    postprocessors = Parser._defaultPostprocessors
  ) {
    this._preprocessors = preprocessors
    this._postprocessors = postprocessors
  }

  parse(string) {
    if (this._cache[string] === undefined) {
      this.addToCache(string)
    }
    const { parsed, error } = this._cache[string]

    if (error) {
      throw error
    }
    return parsed
  }

  addToCache(string) {
    try {
      this._cache[string] = {
        parsed: new MathExpression(string, this._preprocessors, this._postprocessors),
        error: null
      }
    }
    catch (err) {
      this._cache[string] = {
        parsed: null,
        error: err
      }
    }
  }

}

/**
 * returns which symbols are used in expressions
 *
 * @param  {Parser} parser Parser instance
 * @param  {string[]} expressions array of mathematical expression strings
 * @return {set} set of used symbols
 */
export function getUsedSymbols(parser, expressions) {
  return expressions.reduce((usedSymbols, expression) => {
    return setMergeInto(usedSymbols, parser.parse(expression).dependencies)
  }, new Set())
}

import MathExpression from './MathExpression'
import { preprocessHOFs, preprocessMathQuill } from './preprocessors'
import { reassignOperators } from './postprocessors'

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
    if (this._cache[string] !== undefined) {
      return this._cache[string]
    }

    this.addToCache(string)
    return this._cache[string]
  }

  addToCache(string) {
    this._cache[string] = new MathExpression(string, this._preprocessors, this._postprocessors)
  }

}

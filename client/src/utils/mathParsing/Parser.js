// @flow
import MathExpression from './MathExpression'
import { preprocessHOFs, preprocessMathQuill } from './preprocessors'
import { reassignOperators } from './postprocessors'
import { setMergeInto } from '../../utils/sets'
import type {
  PreProcessor,
  PostProcessor
} from './MathExpression'

type ParserCache = {
  [string]: {
    parsed: MathExpression,
    error: null
  } | {
    parsed: null,
    error: Error
  }
}

export default class Parser {

  _cache: ParserCache = {}
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
    preprocessors: Array<PreProcessor> = Parser._defaultPreprocessors,
    postprocessors: Array<PostProcessor> = Parser._defaultPostprocessors
  ) {
    this._preprocessors = preprocessors
    this._postprocessors = postprocessors
  }

  parse(expresssion: string) {
    if (this._cache[expresssion] === undefined) {
      this.addToCache(expresssion)
    }
    const { parsed, error } = this._cache[expresssion]

    if (parsed) {
      return parsed
    }
    throw error
  }

  addToCache(expresssion: string) {
    try {
      this._cache[expresssion] = {
        parsed: new MathExpression(expresssion, this._preprocessors, this._postprocessors),
        error: null
      }
    }
    catch (err) {
      this._cache[expresssion] = {
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
export function getUsedSymbols(
  parser: Parser,
  expressions: Array<string>
): Set<string> {
  return expressions.reduce((usedSymbols, expression) => {
    return setMergeInto(usedSymbols, parser.parse(expression).dependencies)
  }, new Set())
}

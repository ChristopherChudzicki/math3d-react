import {
  Parser,
  ScopeEvaluator
} from 'utils/mathParsing'

export const parser = new Parser()
export const scopeEvaluator = new ScopeEvaluator(parser)

window.parser=parser

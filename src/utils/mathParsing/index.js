import Parser from './Parser'
import { ScopeEvaluator } from './mathscope'

window.parser = new Parser()
window.scopeEvaluator = new ScopeEvaluator(window.parser)

export { default as Parser, getUsedSymbols } from './Parser'
export { default as MathExpression } from './MathExpression'
export { ScopeEvaluator } from './mathscope'

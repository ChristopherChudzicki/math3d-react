// @flow
import { replaceAll, findClosingBrace, findIntegralEnd } from '../../helpers'

/**
 * Makes a series of replacements on MathQuill-generated LaTeX strings so that
 * they can be parsed by MathJS.
 *
 * Notes:
 *  1. This is pretty heuristic. Might discover updates needed.
 *  2. Much of this could be used to preprocess LaTeX generated by other means
 * (i.e., not MathQuill.) The main bit that is MathQuill-specific is probably
 * the operatorname replacements.
 *
 * @param  {string} fromMQ a MathQuill-generated LaTeX expression
 * @return {string} the input expression with LaTeX commands converted to mathjs
 */
export default function mathquillToMathJS(fromMQ: string) {
  const replacements = [
    { tex: '\\operatorname{re}', mathjs: 're' },
    { tex: '\\operatorname{im}', mathjs: 'im' },
    { tex: '\\operatorname{arg}', mathjs: 'arg' },
    { tex: '\\operatorname{conj}', mathjs: 'conj' },
    { tex: '\\operatorname{diff}', mathjs: 'diff' },
    { tex: '\\operatorname{pdiff}', mathjs: 'pdiff' },
    { tex: '\\operatorname{curl}', mathjs: 'curl' },
    { tex: '\\operatorname{div}', mathjs: 'div' },
    { tex: '\\operatorname{norm}', mathjs: 'norm' },
    { tex: '\\operatorname{mod}', mathjs: 'mod' },
    { tex: '\\operatorname{abs}', mathjs: 'abs' },
    { tex: '\\operatorname{unitT}', mathjs: 'unitT' },
    { tex: '\\operatorname{unitN}', mathjs: 'unitN' },
    { tex: '\\operatorname{unitB}', mathjs: 'unitB' },
    { tex: '\\operatorname{arccosh}', mathjs: 'arccosh' },
    { tex: '\\operatorname{arcsinh}', mathjs: 'arcsinh' },
    { tex: '\\operatorname{arctanh}', mathjs: 'arctanh' },
    { tex: '\\operatorname{join}', mathjs: 'concat' },
    { tex: '\\operatorname{transpose}', mathjs: 'transpose' },
    { tex: '\\cdot', mathjs: ' * ' },
    { tex: '\\left|', mathjs: 'norm(' },
    { tex: '\\right|', mathjs: ')' },
    { tex: '\\left', mathjs: '' },
    { tex: '\\right', mathjs: '' },
    { tex: '{', mathjs: '(' },
    { tex: '}', mathjs: ')' },
    { tex: '~', mathjs: ' ' },
    { tex: '\\', mathjs: ' ' }
  ]
  
  //convert integrals
  const inted = convertIntegral(fromMQ)

  // remove fractions, then apply replacements
  const noFrac = fracToDivision(inted)
  const noBraceSub = convertSubscript(noFrac)
  return replacements.reduce(
    (acc, r) => replaceAll(acc, r['tex'], r['mathjs'] ),
    noBraceSub)
}

/**
 * Recursively removes braces from LaTeX subscripts
 *   - example: x_{12foo_{bar123_{evenlower}}} --> x_12foo_bar123_evenlower
 */
export function convertSubscript(expr: string) {
  const sub = '_{'
  const subStart = expr.indexOf(sub)

  if (subStart < 0) { return expr }

  const numStart = subStart + sub.length
  const closingBrace = expr.indexOf('}', numStart)
  const newExpr = expr.slice(0, subStart) +
    '_' +
    expr.slice(numStart, closingBrace) +
    expr.slice(closingBrace + 1)

  return convertSubscript(newExpr)
}

/**
 * Recursively replaces LaTeX fractions with normal divison
 *   - example: \frac{a}{1 + \frac{b}{c}} --> {a}/{1 + {b}/{c}}
 */
export function fracToDivision(expr: string) {
  const frac = '\\frac'
  const fracStart = expr.indexOf(frac)
  const numStart = fracStart + frac.length

  if (fracStart < 0) { return expr }

  const divIdx = findClosingBrace(expr, numStart)
  // Remove frac, and add "/"
  const newExpr = expr.slice(0, fracStart) +
    expr.slice(numStart, divIdx + 1) + '/' +
    expr.slice(divIdx + 1)

  return fracToDivision(newExpr)
}

/**
 * Recursively convert LaTeX integral to integral function
 *   - example: \int_{am}^{bn} xy^2dx --> int(xy^2,am,bn,x)
 */
export function convertIntegral(expr: string) {
  const int = '\\int'
  const intStart = expr.indexOf(int)

  if (intStart < 0) { return expr }

  const intEnd = findIntegralEnd(expr, intStart)

  // Get lower boundary
  const lowerBoundaryStart = 1 + expr.indexOf('_', intStart)
  const lowerBoundaryEnd = expr.indexOf('^', lowerBoundaryStart)
  const lowerBoundary = expr.slice(lowerBoundaryStart, lowerBoundaryEnd)

  // Get upper boundary
  const upperBoundaryStart = lowerBoundaryEnd + 1
  const upperBoundaryEnd  = expr[upperBoundaryStart] === '{' ? findClosingBrace(expr, upperBoundaryStart) + 1 : upperBoundaryStart + 1
  const upperBoundary = expr.slice(upperBoundaryStart, upperBoundaryEnd)

  // Get integrand
  const integrandStart = upperBoundaryEnd
  const integrandEnd = intEnd
  const integrand = expr.slice(integrandStart, integrandEnd) || '1'

  // Get integrating variable
  const integratingVariableStart = intEnd + 1
  const integratingVariableEnd = expr[integratingVariableStart] === '\\' ? expr.indexOf(' ', integratingVariableStart) < 0 ?
    expr.length : expr.indexOf(' ', integratingVariableStart) : integratingVariableStart + 1
  const integratingVariable = expr.slice(integratingVariableStart, integratingVariableEnd)


  // Create int function with the propper arguments
  const newExpr = expr.slice(0, intStart) + ' integrate( ' + 
    integrand + ', ' + lowerBoundary + ', ' +
    upperBoundary + ', ' + integratingVariable + ')' +
    expr.slice(integratingVariableEnd)

  return convertIntegral(newExpr)
}
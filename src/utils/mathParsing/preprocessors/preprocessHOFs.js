// @flow
import { escapeRegExp, replaceAll, findClosingBrace } from '../../helpers'

/**
 * A preprocessor to be used before mathjs's math.parse function. Motivation:
 * For higher-order functions (HOFs) like differentiation, we want to write
 * diff(f)(x), where diff(f) evaluates to a function which is subsequently
 * evaluated at value x.
 *
 * But mathjs's parser can't handle this. It interprets diff(f)(x) as two
 * numbers, diff(f) and (x), implicitly multiplied. The alternative we've
 * settled for is expressions like diff(f, x).
 *
 * So this preprocessor turns user-facing syntax to mathjs-facing syntax:
 *
 * diff(f)(u,v) --> diff(f, u, v)
 *
 * Note that diff(f) without a subsequent evaluation remains unchanged, which
 * can show up second derivatives:
 *
 * diff( diff(f) )(u, v) --> diff( diff(f), u, v)
 *
 * @param  {array<string>} hofNames An array of higher-order function names
 */
export default function preprocessHOFs(hofNames: Array<string>) {
  return (str: string) => hofNames.reduce((acc, c) => convertSingleHOF(acc, c), str)
}

export function convertSingleHOF(expr: string, hofName: string) {
  expr = normalizeHOFExpression(expr, hofName)

  const hofStart = expr.indexOf(hofName)

  if (hofStart < 0) {
    return expr
  }

  const funcStart = hofStart + hofName.length
  const funcClose = findClosingBrace(expr, funcStart)

  // 'PLACEHOLDER' marks a hofName as finished. Brittle, I guess.
  if (expr[funcClose + 1] !== '(') {
    expr = expr.slice(0, hofStart) + 'PLACEHOLDER' + expr.slice(funcStart, expr.length)
  }
  else {
    const argStart = funcClose + 1
    expr = expr.slice(0, hofStart) + 'PLACEHOLDER' + expr.slice(funcStart, funcClose) + ',' + expr.slice(argStart + 1, expr.length)
  }

  // Test if any hofName remain
  if (expr.indexOf(hofName) < 0) {
    return replaceAll(expr, 'PLACEHOLDER', hofName)
  }
  else {
    return convertSingleHOF(expr, hofName)
  }
}

/**
 * Removes some whitespace:
 *  - between hofName and opening parenthesis
 *  - between closing and opening parentheses
 *
 * Example:
 *  diff  (f)  (u, v) --> diff(f)(u, v)
 */
export function normalizeHOFExpression(expr: string, hofName: string) {
  return expr
    .replace(new RegExp(`${escapeRegExp(hofName)}\\s+\\(`), `${hofName}(`)
    .replace(/\)\s+\(/g, ')(')
}

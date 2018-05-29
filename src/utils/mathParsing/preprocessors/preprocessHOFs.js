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
export default function preprocessHOFs(hofNames) {
  return string => hofNames.reduce((acc, c) => convertSingleHOF(acc, c), string)
}

export function convertSingleHOF(string, hofName) {
  string = normalizeHOFExpression(string, hofName)

  const hofStart = string.indexOf(hofName)

  if (hofStart < 0) {
    return string
  }

  const funcStart = hofStart + hofName.length
  const funcClose = findClosingBrace(string, funcStart)

  // 'PLACEHOLDER' marks a hofName as finished. Brittle, I guess.
  if (string[funcClose + 1] !== '(') {
    string = string.slice(0, hofStart) + 'PLACEHOLDER' + string.slice(funcStart, string.length)
  }
  else {
    const argStart = funcClose + 1
    string = string.slice(0, hofStart) + 'PLACEHOLDER' + string.slice(funcStart, funcClose) + ',' + string.slice(argStart + 1, string.length)
  }

  // Test if any hofName remain
  if (string.indexOf(hofName) < 0) {
    return replaceAll(string, 'PLACEHOLDER', hofName)
  }
  else {
    return convertSingleHOF(string, hofName)
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
export function normalizeHOFExpression(string, hofName) {
  return string
    .replace(new RegExp(`${escapeRegExp(hofName)}\\s+\\(`), `${hofName}(`)
    .replace(/\)\s+\(/g, ')(')
}

// @flow
import { EvalErrorData, setError } from 'services/errors'
import type { Scope, Parser, Symbols } from 'utils/mathParsing'
type SetError = typeof setError

// TODO extract and test this
export function evalData(parser: Parser, data: Symbols, scope: Scope) {
  const initial = { evalErrors: {}, evaluated: {}, parseErrors: {} }
  return Object.keys(data).reduce((acc, prop) => {
    try {
      const parsed = parser.parse(data[prop] )
      try {
        acc.evaluated[prop] = parsed.eval(scope)
        return acc
      }
      catch (evalError) {
        acc.evalErrors[prop] = evalError
        return acc
      }
    }
    catch (parseError) {
      acc.parseErrors[prop] = parseError
      return acc
    }
  }, initial)
}

export function handleEvalErrors(
  id: string,
  newErrors: { [propName: string]: Error },
  existingErrors: { [propName: string]: string },
  setError: SetError
) {
  // Remove old errors
  Object.keys(existingErrors).forEach((prop) => {
    if (newErrors[prop]===undefined) {
      setError(id, prop, new EvalErrorData(null))
    }
  } )
  // Add new Errors
  Object.keys(newErrors).forEach((prop) => {
    const { message } = newErrors[prop]
    setError(id, prop, new EvalErrorData(message))
  } )
}

export function filterObject(superObject: Object, keys: Array<string>) {
  return keys.reduce((acc, key) => {
    acc[key] = superObject[key]
    return acc
  }, {} )
}

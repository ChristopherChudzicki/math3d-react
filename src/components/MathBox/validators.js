// @flow

export function isNumeric(value: mixed) {
  return typeof value === 'number'
}

export function validateNumeric(value: mixed) {
  if (isNumeric(value)) { return }
  throw TypeError(`Expected value to be a number, but it was an ${typeof value}`)
}

export function isVector(value: mixed, numComponents: number) {
  if (value instanceof Array) {
    if (value.length !== numComponents) { return false }
    return value.every(x => isNumeric(x))
  }
  return false
}

export function validateVector(value: mixed, numComponents: number) {
  if (isVector(value, numComponents)) { return }
  throw TypeError(`Expected value to be a ${numComponents}-component vector, but it is not.`)
}

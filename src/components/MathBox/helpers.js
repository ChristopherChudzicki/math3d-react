// @flow
export function isEqualNumerically(obj1: mixed, obj2: mixed): bool {
  if (obj1 === obj2) { return true }
  if (!(obj1 instanceof Array && obj2 instanceof Array)) { return false }
  if (obj1.length !== obj2.length) { return false }

  // Both objects are arrays of the same length
  return (obj1: any).every((element, index) => {
    return isEqualNumerically(element, (obj2: any)[index] )
  } )

}

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

import { isEqual } from 'lodash'

function setToJSON(key, value) {
  if (typeof value === 'object' && value instanceof Set) {
    return [...value]
  }
  return value
}

// Jest 22's toEqual matcher correctly compares sets, but react-scripts is using Jest 20.
// Hopefully react-scripts will update soon, and I can get rid of this
export function toEqualAsSet(received, argument) {

  const pass = isEqual(received, argument)

  if (pass) {
    return {
      message: () => `expected ${JSON.stringify(received, setToJSON)} to have same elements as ${JSON.stringify(argument, setToJSON)}`,
      pass: true
    }
  }
  else {
    return {
      message: () => `expected ${JSON.stringify(received, setToJSON)} to have same elements as ${JSON.stringify(argument, setToJSON)}`,
      pass: false
    }
  }
}

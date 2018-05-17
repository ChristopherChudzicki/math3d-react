import {
  // toggleProperty,
  setProperty,
  createMathObject
} from 'containers/MathObjects/actions'
import { VARIABLE } from 'containers/MathObjects/mathObjectTypes'

const defaultSettings = {
  type: VARIABLE,
  name: 'f(x)',
  value: 'e^x',
  description: 'Variable'
}

export const setName = (id, value) => {
  return setProperty(id, VARIABLE, 'name', value)
}

export const setValue = (id, value) => {
  return setProperty(id, VARIABLE, 'value', value)
}

export const createVariable = (id, parentFolderId, positionInFolder) => {
  return createMathObject(id, VARIABLE, parentFolderId, positionInFolder, defaultSettings)
}

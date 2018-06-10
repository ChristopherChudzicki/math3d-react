import {
  createMathObject
} from 'containers/MathObjects/actions'
export const VARIABLE = 'VARIABLE'

const defaultSettings = {
  type: VARIABLE,
  name: 'f(x)',
  value: 'e^x',
  description: 'Variable',
  errors: {}
}

export const createVariable = (id, parentFolderId, positionInFolder) => {
  return createMathObject(id, VARIABLE, parentFolderId, positionInFolder, defaultSettings)
}

import {
  createMathObject
} from 'containers/MathObjects/actions'
import { VARIABLE, defaultSettings } from './metadata'

export const createVariable = (id, parentFolderId, positionInFolder) => {
  return createMathObject(id, VARIABLE, parentFolderId, positionInFolder, defaultSettings)
}

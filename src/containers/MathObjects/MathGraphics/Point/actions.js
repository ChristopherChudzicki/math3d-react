import {
  // toggleProperty,
  setProperty,
  createMathObject
} from 'containers/MathObjects/actions'
import { POINT } from 'containers/MathObjects/mathObjectTypes'

const defaultSettings = {
  type: POINT,
  coords: '\\left[0,0,0\\right]',
  description: 'Point'
}

export const setCoords = (id, value) => {
  return setProperty(id, POINT, 'coords', value)
}

export const createPoint = (id, parentFolderId, positionInFolder) => {
  return createMathObject(id, POINT, parentFolderId, positionInFolder, defaultSettings)
}

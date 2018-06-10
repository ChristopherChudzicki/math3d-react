import {
  createMathObject
} from 'containers/MathObjects/actions'
export const POINT = 'POINT'
export const coords = 'coords'

const defaultSettings = {
  type: POINT,
  coords: '\\left[0,0,0\\right]',
  description: 'Point',
  errors: {}
}

export const createPoint = (id, parentFolderId, positionInFolder) => {
  return createMathObject(id, POINT, parentFolderId, positionInFolder, defaultSettings)
}

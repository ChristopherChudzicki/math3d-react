import {
  createMathObject
} from 'containers/MathObjects/actions'
export const POINT = 'POINT'

const defaultSettings = {
  type: POINT,
  coords: '\\left[0,0,0\\right]',
  description: 'Point',
  color: 'red',
  size: 16,
  visible: true
}

export const createPoint = (id, parentFolderId, positionInFolder) => {
  return createMathObject(id, POINT, parentFolderId, positionInFolder, defaultSettings)
}

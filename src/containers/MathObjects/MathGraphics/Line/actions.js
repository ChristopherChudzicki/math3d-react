import {
  createMathObject
} from 'containers/MathObjects/actions'
export const LINE = 'LINE'

const defaultSettings = {
  type: LINE,
  coords: '\\left[\\left[1,1,1\\right], \\left[-1,1,-1\\right]\\right]',
  description: 'Line',
  color: 'red',
  size: '16',
  visible: true,
  opacity: 1,
  zBias: 'null',
  label: null,
  labelVisible: false
}

export const createLine = (id, parentFolderId, positionInFolder) => {
  return createMathObject(id, LINE, parentFolderId, positionInFolder, defaultSettings)
}

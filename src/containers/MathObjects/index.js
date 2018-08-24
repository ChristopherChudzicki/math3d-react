// @flow
import Folder from './Folder'
import MathGraphics from './MathGraphics'
import MathSymbols from './MathSymbols'

export { Folder, MathGraphics, MathSymbols }

export default {
  [Folder.type]: Folder,
  ...MathSymbols,
  ...MathGraphics
}

export { createPoint } from './MathGraphics/Point/actions'
export { createLine } from './MathGraphics/Line/actions'
export { createVariable } from './MathSymbols/Variable/actions'
export { createVariableSlider } from './MathSymbols/VariableSlider/actions'
export { createFolder } from './Folder/actions'

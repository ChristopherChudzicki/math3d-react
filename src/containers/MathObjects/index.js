import Point from './MathGraphics/Point'
import Line from './MathGraphics/Line'
import Variable from './MathSymbols/Variable'
import VariableSlider from './MathSymbols/VariableSlider'
import Folder from './Folder'
import { POINT, LINE, VARIABLE, VARIABLE_SLIDER, FOLDER } from './mathObjectTypes'

export default {
  [POINT]: Point,
  [LINE]: Line,
  [VARIABLE]: Variable,
  [VARIABLE_SLIDER]: VariableSlider,
  [FOLDER]: Folder
}

export { createPoint } from './MathGraphics/Point/actions'
export { createLine } from './MathGraphics/Line/actions'
export { createVariable } from './MathSymbols/Variable/actions'
export { createVariableSlider } from './MathSymbols/VariableSlider/actions'
export { createFolder } from './Folder/actions'

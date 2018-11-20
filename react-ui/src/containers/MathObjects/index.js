// @flow
import Folder from './Folder'
import MathGraphics from './MathGraphics'
import MathSymbols from './MathSymbols'
import type { MathObjectWrapper } from './MathObject'

export { Folder, MathGraphics, MathSymbols }

const mathObjects : { [string]: MathObjectWrapper } = {
  [Folder.type]: Folder,
  ...MathSymbols,
  ...MathGraphics
}

export default mathObjects

export { FOLDER } from './Folder'
export { VARIABLE, VARIABLE_SLIDER, BOOLEAN_VARIABLE } from './MathSymbols'
export {
  CAMERA,
  AXIS,
  GRID,
  POINT,
  LINE,
  VECTOR,
  PARAMETRIC_CURVE,
  IMPLICIT_SURFACE,
  VECTOR_FIELD
} from './MathGraphics'

window.MathObjects = mathObjects

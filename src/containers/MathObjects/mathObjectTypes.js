import { POINT } from './MathGraphics/Point/actions'
import { VARIABLE } from './MathSymbols/Variable/actions'
import { VARIABLE_SLIDER } from './MathSymbols/VariableSlider/actions'
import { FOLDER } from './Folder/actions'

export { POINT, VARIABLE, VARIABLE_SLIDER, FOLDER }

export const mapTypeToState = {
  [FOLDER]: 'folders',
  [POINT]: 'mathGraphics',
  [VARIABLE]: 'mathSymbols',
  [VARIABLE_SLIDER]: 'mathSymbols'
}

export const mathObjectTypes = Object.keys(mapTypeToState)

import { POINT } from './MathGraphics/Point/actions'
import { VARIABLE } from './MathSymbols/Variable/actions'
import { VARIABLE_SLIDER } from './MathSymbols/VariableSlider/actions'
import { FOLDER } from './Folder/actions'

// Not really a mathObject. Holds errors for all Math Objects
const ERROR = 'ERROR'

export { POINT, VARIABLE, VARIABLE_SLIDER, FOLDER, ERROR }

export const mapTypeToState = {
  [FOLDER]: 'folders',
  [POINT]: 'mathGraphics',
  [VARIABLE]: 'mathSymbols',
  [VARIABLE_SLIDER]: 'mathSymbols',
  [ERROR]: 'errors'
}

export const mathObjectTypes = Object.keys(mapTypeToState)

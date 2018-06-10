import { POINT } from './MathGraphics/Point/actions'
import { VARIABLE } from './MathSymbols/Variable/actions'
import { FOLDER } from './Folder/actions'

export { POINT, VARIABLE, FOLDER }

export const mapTypeToState = {
  [FOLDER]: 'folders',
  [POINT]: 'mathGraphics',
  [VARIABLE]: 'mathSymbols'
}

export const mathObjectTypes = Object.keys(mapTypeToState)

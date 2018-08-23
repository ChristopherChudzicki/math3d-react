import { POINT } from './MathGraphics/Point/actions'
import { LINE } from './MathGraphics/Line/actions'
import { VARIABLE } from './MathSymbols/Variable/actions'
import { VARIABLE_SLIDER } from './MathSymbols/VariableSlider/actions'
import { FOLDER } from './Folder/actions'
import {
  Point as PointGraphic,
  Line as LineGraphic
} from 'components/MathBox'

export { POINT, LINE, VARIABLE, VARIABLE_SLIDER, FOLDER }

export const mapTypeToState = {
  [FOLDER]: 'folders',
  [POINT]: 'mathGraphics',
  [LINE]: 'mathGraphics',
  [VARIABLE]: 'mathSymbols',
  [VARIABLE_SLIDER]: 'mathSymbols'
}

export const mapTypeToGraphic = {
  [POINT]: PointGraphic,
  [LINE]: LineGraphic
}

export const mathObjectTypes = Object.keys(mapTypeToState)

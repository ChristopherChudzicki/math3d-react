import {
  createMathObject
} from 'containers/MathObjects/actions'
import { VARIABLE_SLIDER, defaultSettings } from './metadata'

export const SET_SLIDER_VALUE = 'SET_SLIDER_VALUE'

export const createVariableSlider = (id, parentFolderId, positionInFolder) => {
  return createMathObject(id, VARIABLE_SLIDER, parentFolderId, positionInFolder, defaultSettings)
}

export function setSliderValue(id, value) {
  return {
    type: SET_SLIDER_VALUE,
    payload: { id, value }
  }
}

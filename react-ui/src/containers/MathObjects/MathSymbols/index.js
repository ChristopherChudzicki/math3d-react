// @flow
import Variable, { VARIABLE } from './Variable'
import VariableSlider, { VARIABLE_SLIDER } from './VariableSlider'

export default {
  [Variable.type]: Variable,
  [VariableSlider.type]: VariableSlider
}

export { VARIABLE, VARIABLE_SLIDER }

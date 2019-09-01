// @flow
import Variable, { VARIABLE } from './Variable'
import BooleanVariable, { BOOLEAN_VARIABLE } from './BooleanVariable'
import VariableSlider, { VARIABLE_SLIDER } from './VariableSlider'

export default {
  [Variable.type]: Variable,
  [VariableSlider.type]: VariableSlider,
  [BooleanVariable.type]: BooleanVariable
}

export { VARIABLE, VARIABLE_SLIDER, BOOLEAN_VARIABLE }

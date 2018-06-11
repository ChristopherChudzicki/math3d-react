import { VARIABLE, VARIABLE_SLIDER } from 'containers/MathObjects/mathObjectTypes'
import { createReducer } from 'containers/MathObjects/reducer'

const mathVariables = new Set( [VARIABLE, VARIABLE_SLIDER] )

export default createReducer(mathVariables)

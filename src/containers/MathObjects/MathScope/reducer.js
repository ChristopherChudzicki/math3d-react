import { VARIABLE } from 'containers/MathObjects/mathObjectTypes'
import { createReducer } from 'containers/MathObjects/reducer'

const mathVariables = new Set( [VARIABLE] )

export default createReducer(mathVariables)

import { FOLDER } from 'containers/MathObjects/mathObjectTypes'
import { createReducer } from 'containers/MathObjects/reducer'

export default createReducer(new Set( [FOLDER] ))

import { POINT } from 'containers/MathObjects/mathObjectTypes'
import { createReducer } from 'containers/MathObjects/reducer'

const mathGraphics = new Set( [POINT] )

export default createReducer(mathGraphics)

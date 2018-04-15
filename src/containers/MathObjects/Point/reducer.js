import { POINT } from 'containers/MathObjects/mathObjectTypes'
import { createReducer } from 'containers/MathObjects/reducer'

const defaultSettings = {
  coords: '\\left[0,0,0\\right]'
}

export default createReducer(POINT, defaultSettings)

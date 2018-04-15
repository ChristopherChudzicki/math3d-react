import { FOLDER } from 'containers/MathObjects/mathObjectTypes'
import { createReducer } from 'containers/MathObjects/reducer'

const defaultSettings = {
  isCollapsed: false
}

export default createReducer(FOLDER, defaultSettings)

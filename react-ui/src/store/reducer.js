import { combineReducers } from 'redux'
import drawers from 'containers/Drawer/reducer'
import sortableTree from 'containers/SortableTree/reducer'
import sliderValues from 'containers/MathObjects/MathSymbols/VariableSlider/reducer'
import activeObject from 'containers/MathObjects/services/activeObject/reducer'
import metadata from 'services/metadata/reducer'
import {
  folders,
  mathGraphics,
  mathSymbols
} from 'containers/MathObjects/reducer'
import { LOAD_STATE } from './actions'

import {
  parseErrors,
  evalErrors,
  renderErrors
} from 'services/errors/reducer'

const combinedReducer = combineReducers( {
  metadata,
  drawers,
  sortableTree,
  folders,
  mathGraphics,
  mathSymbols,
  parseErrors,
  evalErrors,
  renderErrors,
  sliderValues,
  activeObject
} )

export default function rootReducer(state, action) {
  if (action.type === LOAD_STATE) {
    return { ...state, ...action.payload.state }
  }
  return combinedReducer(state, action)
}

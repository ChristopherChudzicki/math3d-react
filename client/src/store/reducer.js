import cloneDeep from 'clone-deep'
import { combineReducers } from 'redux'
import drawers from 'containers/Drawer/reducer'
import tabs from 'containers/ControlledTabs/reducer'
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
import lastSavedState from 'store/lastSavedState/reducer'

import {
  parseErrors,
  evalErrors,
  renderErrors
} from 'services/errors/reducer'

const combinedReducer = combineReducers( {
  metadata,
  drawers,
  tabs,
  sortableTree,
  folders,
  mathGraphics,
  mathSymbols,
  parseErrors,
  evalErrors,
  renderErrors,
  sliderValues,
  activeObject,
  lastSavedState
} )

export default function rootReducer(state, action) {
  if (action.type === LOAD_STATE) {
    const { lastSavedState: previousLastSavedState, ...oldState } = state
    const newState = { ...oldState, ...action.payload.state }
    const lastSavedState = cloneDeep(newState)
    return { ...newState, lastSavedState }
  }
  return combinedReducer(state, action)
}

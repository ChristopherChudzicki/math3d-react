import { combineReducers } from 'redux'
import drawers from './containers/Drawer/reducer'
import sortableTree from './containers/SortableTree/reducer'
import sliderValues from './containers/MathObjects/MathSymbols/VariableSlider/reducer'
import activeObject from './containers/MathObjects/services/activeObject/reducer'
import {
  folders,
  mathGraphics,
  mathSymbols,
  errors
} from './containers/MathObjects/reducer'

export default combineReducers( {
  drawers,
  sortableTree,
  folders,
  mathGraphics,
  mathSymbols,
  errors,
  sliderValues,
  activeObject
} )

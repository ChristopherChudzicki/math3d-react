import { combineReducers } from 'redux'
import drawers from './containers/Drawer/reducer'
import sortableTree from './containers/SortableTree/reducer'
import folders from './containers/MathObjects/Folder/reducer'
import mathGraphics from './containers/MathObjects/MathGraphics/reducer'
import mathScope from './containers/MathObjects/MathScope/reducer'
import activeObject from './containers/MathObjects/services/activeObject/reducer'

export default combineReducers( {
  drawers,
  sortableTree,
  folders,
  mathGraphics,
  mathScope,
  activeObject
} )

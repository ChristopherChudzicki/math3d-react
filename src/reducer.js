import { combineReducers } from 'redux'
import drawers from './containers/Drawer/reducer'
import sortableTree from './containers/SortableTree/reducer'
import folders from './containers/MathObjects/Folder/reducer'
import points from './containers/MathObjects/Point/reducer'
import activeObject from './containers/MathObjects/services/activeObject/reducer'

export default combineReducers( {
  drawers,
  sortableTree,
  folders,
  points,
  activeObject
} )

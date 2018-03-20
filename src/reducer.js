import { combineReducers } from 'redux'
import drawers from './containers/Drawer/reducer'
import sortableTree from './containers/SortableTree/reducer'
import folders from './containers/MathObjects/Folder/reducer'
import activeObject from './containers/MathObjects/services/ActiveObject/reducer'

export default combineReducers( {
  drawers,
  sortableTree,
  folders,
  activeObject
} )

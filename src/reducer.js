import { combineReducers } from 'redux'
import drawers from './containers/Drawer/reducer'
import sortableTree from './containers/SortableTree/reducer'
import folders from './containers/MathObjects/Folder/reducer'

export default combineReducers( {
  drawers: drawers,
  sortableTree: sortableTree,
  folders: folders
} )

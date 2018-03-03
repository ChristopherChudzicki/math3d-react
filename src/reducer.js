import { combineReducers } from 'redux'
import drawers from './containers/Drawer/reducer'
import mathTree from './containers/MathTree/reducer'

export default combineReducers( {
  drawers: drawers,
  mathTree: mathTree
} )

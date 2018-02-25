import { combineReducers } from 'redux'
import drawers from './containers/Drawer/reducer'

export default combineReducers( {
  drawers: drawers
} )

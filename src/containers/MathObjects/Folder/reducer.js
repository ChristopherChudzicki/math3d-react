import { TOGGLE_CONTENT_COLLAPSED } from './actions'
import update from 'immutability-helper'

const initialState = {}

export default (state = initialState, { type, payload } ) => {
  switch (type) {

    case TOGGLE_CONTENT_COLLAPSED:
      return update(state, {
        [payload.id]: { $toggle: ['isCollapsed'] }
      } )

    default:
      return state

  }
}

import update from 'immutability-helper'
import {
  TOGGLE_PROPERTY,
  SET_PROPERTY
} from './actions'

const initialState = {}

export function createReducer(mathObjectName = '') {

  return (state = initialState, action) => {

    const { name, type, payload } = action
    if (name !== mathObjectName) return state

    switch (type) {

      case TOGGLE_PROPERTY:
        return update(state, {
          [payload.id]: { $toggle: [payload.property] }
        } )
      case SET_PROPERTY:
        return update(state, {
          [payload.id]: { [payload.property]: { $set: payload.value } }
        } )
      default:
        return state

    }
  }
}

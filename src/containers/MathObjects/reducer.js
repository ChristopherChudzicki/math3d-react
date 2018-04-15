import update from 'immutability-helper'
import {
  TOGGLE_PROPERTY,
  SET_PROPERTY,
  CREATE_MATH_OBJECT,
  DELETE_MATH_OBJECT
} from './actions'

const initialState = {}

export function createReducer(mathObjectName, defaultSettings) {

  return (state = initialState, action) => {

    const { name, type, payload } = action
    if (name !== mathObjectName) return state

    switch (type) {

      case CREATE_MATH_OBJECT:
        return update(state, {
          $merge: { [payload.id]: { ...payload.settings, ...defaultSettings } }
        } )
      case DELETE_MATH_OBJECT:
        return update(state, {
          $unset: [ payload.id ]
        } )
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

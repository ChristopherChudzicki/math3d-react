import update from 'immutability-helper'
import {
  TOGGLE_PROPERTY,
  SET_PROPERTY,
  CREATE_MATH_OBJECT,
  DELETE_MATH_OBJECT,
  ADD_ERROR,
  REMOVE_ERROR
} from './actions'

const initialState = {}

/**
 * creates a reducer
 *
 * @param  {Set} mathObjectNames names of mathObjects handled by this reducer
 * @return {function}
 */
export function createReducer(mathObjectNames) {

  return (state = initialState, action) => {

    const { name, type, payload } = action
    if (!mathObjectNames.has(name)) return state

    switch (type) {

      case CREATE_MATH_OBJECT:
        return update(state, {
          $merge: { [payload.id]: { ...payload.settings } }
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
      case ADD_ERROR: {
        const { id, errorProp, errorMsg } = payload
        return update(state, {
          [id]: {
            errors: {
              [errorProp]: { $set: errorMsg }
            }
          }
        } )
      }
      case REMOVE_ERROR: {
        const { id, errorProp } = payload
        return update(state, {
          [id]: {
            errors: {
              $unset: [errorProp]
            }
          }
        } )
      }
      default:
        return state

    }
  }
}

import update from 'immutability-helper'
import {
  TOGGLE_PROPERTY,
  SET_PROPERTY,
  UNSET_PROPERTY,
  SET_PROPERTY_AND_ERROR,
  SET_ERROR,
  CREATE_MATH_OBJECT,
  DELETE_MATH_OBJECT
} from './actions'
import {
  FOLDER,
  VARIABLE,
  VARIABLE_SLIDER,
  POINT,
  PARSE_ERROR
} from './mathObjectTypes'

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
      case SET_PROPERTY_AND_ERROR: // falls through to SET_PROPERTY
      case SET_PROPERTY:
        return update(state, {
          [payload.id]: { [payload.property]: { $set: payload.value } }
        } )
      case UNSET_PROPERTY:
        return update(state, {
          [payload.id]: { $unset: [payload.property] }
        } )
      default:
        return state

    }
  }
}

export const folders = createReducer(new Set( [FOLDER] ))
export const mathSymbols = createReducer(new Set( [VARIABLE, VARIABLE_SLIDER] ))
export const mathGraphics = createReducer(new Set( [POINT] ))

export function createErrorReducer(errorTypes) {
  return (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

      case SET_PROPERTY_AND_ERROR: // falls through to SET_ERROR
      case SET_ERROR: {
        const { id, property } = payload
        const { errorType, errorMsg } = payload.error
        if (!errorTypes.has(errorType)) {
          return state
        }

        return errorMsg
          ? update(state, {
            [id]: { [property]: { $set: errorMsg } }
          } )
          : update(state, {
            [id]: { $unset: [property] }
          } )
      }

      default:
        return state

    }

  }
}

export const parseErrors = createErrorReducer(new Set( [PARSE_ERROR] ))

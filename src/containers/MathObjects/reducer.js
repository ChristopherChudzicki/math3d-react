import update from 'immutability-helper'
import {
  TOGGLE_PROPERTY,
  SET_PROPERTY,
  UNSET_PROPERTY,
  SET_PROPERTY_AND_ERROR,
  CREATE_MATH_OBJECT,
  DELETE_MATH_OBJECT
} from './actions'
import MathObjects, {
  Folder,
  MathSymbols,
  MathGraphics
} from './index'

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

      case CREATE_MATH_OBJECT: {
        const settings = { ...MathObjects[name].defaultSettings, ...payload.settings }
        return update(state, {
          $merge: { [payload.id]: settings }
        } )
      }
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

export const folders = createReducer(new Set( [Folder.type] ))
export const mathSymbols = createReducer(new Set(Object.keys(MathSymbols)))
export const mathGraphics = createReducer(new Set(Object.keys(MathGraphics)))

import update from 'immutability-helper'
import { FOLDER } from 'containers/MathObjects'
import {
  PARSE_ERROR,
  EVAL_ERROR,
  RENDER_ERROR
} from './ErrorData'
import { SET_ERROR, UNSET_ERROR } from './actions'
import {
  CREATE_MATH_OBJECT,
  DELETE_MATH_OBJECT
} from 'containers/MathObjects/actions'

const initialState = {}

export function createErrorReducer(errorTypes) {
  return (state = initialState, action) => {

    const { type, payload, name } = action

    switch (type) {

      case SET_ERROR: {
        const { id, property } = payload
        const { type: errorType, errorMsg } = payload.errorData

        return errorTypes.has(errorType)
          ? update(state, {
            [id]: { [property]: { $set: errorMsg } }
          } )
          : state
      }

      case UNSET_ERROR: {
        const { id, property } = payload
        const { type: errorType } = payload.errorData
        return errorTypes.has(errorType)
          ? update(state, {
            [id]: { $unset: [property] }
          } )
          : state
      }

      case CREATE_MATH_OBJECT: {
        const { id } = payload
        // Folders don't have any math-input fields, so they will
        // never contain errors
        if (name === FOLDER) {
          return state
        }
        return update(state, { [id]: { $set: {} } } )
      }

      case DELETE_MATH_OBJECT: {
        const { id } = payload
        return update(state, { $unset: [id] } )
      }

      default:
        return state

    }

  }
}

export const parseErrors = createErrorReducer(new Set( [PARSE_ERROR] ))
export const evalErrors = createErrorReducer(new Set( [EVAL_ERROR] ))
export const renderErrors = createErrorReducer(new Set( [RENDER_ERROR] ))

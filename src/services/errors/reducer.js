import update from 'immutability-helper'
import { PARSE_ERROR, EVAL_ERROR, RENDER_ERROR } from './index'
import { SET_ERROR } from './actions'
import {
  CREATE_MATH_OBJECT,
  DELETE_MATH_OBJECT
} from 'containers/MathObjects/actions'

const initialState = {}

export function createErrorReducer(errorTypes) {
  return (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

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

      case CREATE_MATH_OBJECT: {
        const { id } = payload
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

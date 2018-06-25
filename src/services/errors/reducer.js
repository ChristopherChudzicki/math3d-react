import update from 'immutability-helper'
import { PARSE_ERROR } from './index'
import { SET_ERROR } from './actions'

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

      default:
        return state

    }

  }
}

export const parseErrors = createErrorReducer(new Set( [PARSE_ERROR] ))

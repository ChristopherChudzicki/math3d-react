import { SET_DESCRIPTION } from './actions'
import update from 'immutability-helper'

const initialState = {}

export default function(state = initialState, { type, payload } ) {
  switch (type) {

    case SET_DESCRIPTION:
      const { id, value } = payload
      return update(state, {
        [id]: { $set: value }
      } )
    default:
      return state

  }
}

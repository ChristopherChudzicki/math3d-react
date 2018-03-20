import { SET_ACTIVE_OBJECT } from './actions'

const initialState = null

export default function(state = initialState, { type, payload } ) {
  switch (type) {

    case SET_ACTIVE_OBJECT:
      return payload.id
    default:
      return state

  }
}

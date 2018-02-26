import { SET_VISIBILITY } from './actions'

const initialState = {
  main: true
}

export default (state = initialState, { type, payload } ) => {
  switch (type) {

    case SET_VISIBILITY:
      return {
        ...state,
        [payload.id]: payload.visibility
      }
    default:
      return state

  }
}

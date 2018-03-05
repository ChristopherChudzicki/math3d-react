import { SET_VISIBILITY, SET_ANIMATION_STATUS } from './actions'

export const initialState = {
  main: {
    isVisible: true,
    isAnimating: false
  },
  examples: {
    isVisible: true,
    isAnimating: false
  }
}

export default (state = initialState, { type, payload } ) => {
  switch (type) {

    case SET_VISIBILITY:
      return {
        ...state,
        [payload.id]: { ...state[payload.id], isVisible: payload.isVisible }
      }
    case SET_ANIMATION_STATUS:
      return {
        ...state,
        [payload.id]: { ...state[payload.id], isAnimating: payload.isAnimating }
      }
    default:
      return state

  }
}

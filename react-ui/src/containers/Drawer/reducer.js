import { SET_VISIBILITY, SET_ANIMATION_STATUS, SET_WIDTH } from './actions'

export const DEFAULT_WIDTH = '400px'

export const initialState = {
  main: {
    isVisible: true,
    isAnimating: false,
    width: DEFAULT_WIDTH
  },
  examples: {
    isVisible: false,
    isAnimating: false,
    width: DEFAULT_WIDTH
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
    case SET_WIDTH: {
      const { id, width } = payload
      return {
        ...state,
        [id]: { ...state[id], width }
      }
    }
    default:
      return state

  }
}

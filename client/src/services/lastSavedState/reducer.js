import { SET_SAVED_STATE } from './actions';

const initialState = {
  state: {},
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type ) {
    case SET_SAVED_STATE:
      return payload.state
    default:
      return state
  }
}
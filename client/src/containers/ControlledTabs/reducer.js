import { SET_ACTIVE_TAB } from './actions'
import { CREATE_MATH_OBJECT } from '../../containers/MathObjects/actions'
const initialState = {
  controls: {
    activeTab: '1'
  },
  examples: {
    activeTab: '1'
  }
}

export default function tabs(state = initialState, action) {
  const { type, payload } = action

  switch (type) {

    case SET_ACTIVE_TAB: {
      const { id, activeTab } = payload
      return {
        ...state,
        [id]: { activeTab }
      }
    }
    case CREATE_MATH_OBJECT: {

      return state.controls.activeTab === '1'
        ? state
        : { ...state, controls: { activeTab: '1' } }
    }
    default: {
      return state
    }

  }

}

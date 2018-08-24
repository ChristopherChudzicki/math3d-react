import { CREATE_MATH_OBJECT } from 'containers/MathObjects/actions'
import { SET_SLIDER_VALUE } from './actions'
import { defaultValue } from './metadata'
const initialState = {}

export default function sliderValues(state = initialState, action) {
  const { type, payload } = action

  switch (type) {

    case SET_SLIDER_VALUE: {
      const { id, value } = payload
      return { ...state, [id]: value }
    }

    case CREATE_MATH_OBJECT: {
      const { id } = payload
      return { ...state, [id]: defaultValue }
    }

    default:
      return state

  }

}

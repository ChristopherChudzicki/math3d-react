import update from 'immutability-helper'
import { CREATE_MATH_OBJECT } from 'containers/MathObjects/actions'
import { SET_SLIDER_VALUE } from './actions'
const initialState = {}

export default function sliderValues(state = initialState, action) {
  const { type, payload } = action

  switch (type) {

    case SET_SLIDER_VALUE: {
      const { id, value } = payload
      return { ...state, [id]: value }
    }

    default:
      return state

  }

}

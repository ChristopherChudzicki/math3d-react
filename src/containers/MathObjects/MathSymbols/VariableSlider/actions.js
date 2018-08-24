export const SET_SLIDER_VALUE = 'SET_SLIDER_VALUE'

export function setSliderValue(id, value) {
  return {
    type: SET_SLIDER_VALUE,
    payload: { id, value }
  }
}

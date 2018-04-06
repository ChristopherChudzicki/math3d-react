export const TOGGLE_PROPERTY = 'TOGGLE_PROPERTY'
export const SET_PROPERTY = 'SET_PROPERTY'

export function toggleProperty(id, name, property) {
  return {
    type: TOGGLE_PROPERTY,
    name,
    payload: { id, property }
  }
}

export function setProperty(id, name, property, value) {
  return {
    type: SET_PROPERTY,
    name,
    payload: { id, property, value }
  }
}

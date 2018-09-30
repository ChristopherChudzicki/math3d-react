export const SET_ACTIVE_OBJECT = 'SET_ACTIVE_OBJECT'

export function setActiveObject(id = null) {
  return {
    type: SET_ACTIVE_OBJECT,
    payload: { id }
  }
}

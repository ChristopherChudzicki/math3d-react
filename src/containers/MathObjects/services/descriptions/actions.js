export const SET_DESCRIPTION = 'SET_DESCRIPTION'

export function setDescription(id, value) {
  return {
    type: SET_DESCRIPTION,
    payload: { id, value }
  }
}

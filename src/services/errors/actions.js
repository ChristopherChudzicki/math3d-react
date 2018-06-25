export const SET_ERROR = 'SET_ERROR'

export function setError(id, property, error) {
  return {
    type: SET_ERROR,
    payload: { id, property, error }
  }
}

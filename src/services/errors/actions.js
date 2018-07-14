export const SET_ERROR = 'SET_ERROR'
export const UNSET_ERROR = 'UNSET_ERROR'

export function setError(id, property, error) {
  return error.errorMsg
    ? {
      type: SET_ERROR,
      payload: { id, property, error }
    }
    : {
      type: UNSET_ERROR,
      payload: { id, property, error }
    }
}

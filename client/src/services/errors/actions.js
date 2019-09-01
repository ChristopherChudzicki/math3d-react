// @flow
import { ErrorData } from './ErrorData'

export const SET_ERROR = 'SET_ERROR'
export const UNSET_ERROR = 'UNSET_ERROR'

export function setError(id: string, property: string, errorData: ErrorData) {
  return errorData.isError
    ? {
      type: SET_ERROR,
      payload: { id, property, errorData }
    }
    : {
      type: UNSET_ERROR,
      payload: { id, property, errorData }
    }
}

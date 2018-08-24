// @flow
import { batchActions } from 'redux-batched-actions'
import { setError } from 'services/errors'
import type { ErrorData } from 'services/errors/ErrorData'

export const TOGGLE_PROPERTY = 'TOGGLE_PROPERTY'
export const SET_PROPERTY = 'SET_PROPERTY'
export const UNSET_PROPERTY = 'UNSET_PROPERTY'
export const SET_PROPERTY_AND_ERROR = 'SET_PROPERTY_AND_ERROR'
export const SET_ERROR = 'SET_ERROR'
export const CREATE_MATH_OBJECT = 'CREATE_MATH_OBJECT'
export const DELETE_MATH_OBJECT = 'DELETE_MATH_OBJECT'

export function toggleProperty(id: string, name: string, property: string) {
  return {
    type: TOGGLE_PROPERTY,
    name,
    payload: { id, property }
  }
}

export function setProperty(id: string, name: string, property: string, value: any) {
  return {
    type: SET_PROPERTY,
    name,
    payload: { id, property, value }
  }
}

export function setPropertyAndError(id: string, name: string, property: string, value: any, error: ErrorData) {
  return batchActions( [
    setProperty(id, name, property, value),
    setError(id, property, error)
  ], 'SET_PROPERTY_AND_ERROR')
}

export function createMathObject(
  id: string,
  name: string,
  parentFolderId: string,
  positionInFolder: number,
  settings: ?Object = {}
) {
  return {
    type: CREATE_MATH_OBJECT,
    name,
    payload: { parentFolderId, positionInFolder, id, settings }
  }
}

export function deleteMathObject(id: string, name: string, parentId: string, positionInParent: number) {
  return {
    type: DELETE_MATH_OBJECT,
    name,
    payload: { parentId, id, positionInParent }
  }
}

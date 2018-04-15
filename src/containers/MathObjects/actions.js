export const TOGGLE_PROPERTY = 'TOGGLE_PROPERTY'
export const SET_PROPERTY = 'SET_PROPERTY'
export const CREATE_MATH_OBJECT = 'CREATE_MATH_OBJECT'
export const DELETE_MATH_OBJECT = 'DELETE_MATH_OBJECT'

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

export function createMathObject(id, name, parentFolderId, positionInFolder, settings = {} ) {
  return {
    type: CREATE_MATH_OBJECT,
    name,
    payload: { parentFolderId, positionInFolder, id, settings }
  }
}

export function deleteMathObject(id, name, parentId, positionInParent) {
  return {
    type: DELETE_MATH_OBJECT,
    name,
    payload: { parentId, id, positionInParent }
  }
}

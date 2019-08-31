// @flow
export const SET_TITLE = 'SET_TITLE'

export function setTitle(title: string) {
  return {
    type: SET_TITLE,
    payload: { title }
  }
}

export const SET_CREATION_DATE = 'SET_CREATION_DATE'

export function setCreationDate() {
  return {
    type: SET_CREATION_DATE,
    payload: { creationDate: JSON.stringify(new Date()) }
  }
}

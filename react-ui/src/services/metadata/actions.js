// @flow
export const SET_TITLE = 'SET_TITLE'

export function setTitle(title: string) {
  return {
    type: SET_TITLE,
    payload: { title }
  }
}

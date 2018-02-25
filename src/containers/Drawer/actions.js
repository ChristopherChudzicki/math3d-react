const SET_VISIBILITY = 'SET_VISIBILITY'

export const setVisibility = (id, visibility) => ( {
  type: SET_VISIBILITY,
  payload: { id, visibility }
} )

import cssTime from 'css-time'

export const SET_VISIBILITY = 'SET_VISIBILITY'
export const SET_ANIMATION_STATUS = 'SET_ANIMATION_STATUS'
export const OPEN_DRAWER = 'OPEN_DRAWER'
export const CLOSE_DRAWER = 'CLOSE_DRAWER'

export const setVisibility = (id, isVisible) => ( {
  type: SET_VISIBILITY,
  payload: { id, isVisible }
} )

export const setAnimationStatus = (id, isAnimating) => ( {
  type: SET_ANIMATION_STATUS,
  payload: { id, isAnimating }
} )

export const closeDrawer = (id, animationSpeed) => {
  const msDuration = cssTime.from(animationSpeed)
  return dispatch => {
    dispatch(setVisibility(id, false))
    dispatch(setAnimationStatus(id, true))
    setTimeout(() => dispatch(setAnimationStatus(id, false)), msDuration)
  }
}

export const openDrawer = (id, animationSpeed) => {
  const msDuration = cssTime.from(animationSpeed)
  return dispatch => {
    dispatch(setVisibility(id, true))
    dispatch(setAnimationStatus(id, true))
    setTimeout(() => dispatch(setAnimationStatus(id, false)), msDuration)
  }
}

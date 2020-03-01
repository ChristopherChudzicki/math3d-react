import cloneDeep from 'clone-deep'
export const SET_SAVED_STATE = 'SET_SAVED_STATE';

function setLastSavedStateAs(state) {
  return {
    type: SET_SAVED_STATE,
    payload: { state },
  }
}

export function setLastSavedState() {
  return (dispatch, getStore) => {
    const clonedStore = cloneDeep(getStore());
    return dispatch(setLastSavedStateAs(clonedStore))
  }
}
import { rehydrate } from './hydration'
export const LOAD_STATE = 'LOAD_STATE'

export function loadDehydratedState(dehydrated) {
  return {
    type: LOAD_STATE,
    payload: {
      state: rehydrate(dehydrated)
    }
  }
}

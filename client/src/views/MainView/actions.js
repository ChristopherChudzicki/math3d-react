import { getGraph } from 'services/api'
import { loadDehydratedState } from 'store/actions'

export function loadGraphFromDb(id) {

  return async dispatch => {
    const { dehydrated } = await getGraph(id)
    if (dehydrated) {
      const action = loadDehydratedState(dehydrated)
      return dispatch(action)
    }
    else {
      console.group()
      console.warn(`Graph ${id} not found`)
      // TODO: Better error handling on client
      console.groupEnd()
    }
  }
}

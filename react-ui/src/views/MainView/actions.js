import { getGraph } from 'services/api'
import { loadDehydratedState } from 'store/actions'

export function loadGraphFromDb(id) {

  return async dispatch => {
    const { dehydrated } = await getGraph(id)
    const action = loadDehydratedState(dehydrated)
    return dispatch(action)
  }
}

import { getGraph } from 'services/api'
import { loadDehydratedState } from 'store/actions'

export function loadGraph(id) {

  return async dispatch => {
    const { dehydrated } = await getGraph(id)
    const action = loadDehydratedState(dehydrated)
    return dispatch(action)
  }
}

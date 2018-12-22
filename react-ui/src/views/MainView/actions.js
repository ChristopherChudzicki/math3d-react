import { getGraph, updateGraph } from 'services/api'
import { loadDehydratedState } from 'store/actions'

export function loadGraphFromDb(id) {

  return async dispatch => {
    const { dehydrated, timesAcessed = 0 } = await getGraph(id)
    updateGraph(id, { timesAcessed: timesAcessed + 1 } )
    const action = loadDehydratedState(dehydrated)
    return dispatch(action)
  }
}

import { getGraph, updateGraph } from 'services/api'
import { loadDehydratedState } from 'store/actions'

export function loadGraphFromDb(id) {

  return async dispatch => {
    const { dehydrated, timesAccessed = 0 } = await getGraph(id)
    updateGraph(id, { timesAccessed: timesAccessed + 1 } )
    const action = loadDehydratedState(dehydrated)
    return dispatch(action)
  }
}

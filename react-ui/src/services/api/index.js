// Example api call:

export const getGraph = (id) => fetch(`api/graph/${id}`, {
  method: 'GET',
  headers: {}
} ).then(res => res.json())

export const saveGraph = (id, state) => {
  const body = {
    '_id': id,
    state: state
  }
  return fetch(`/api/graph`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  } ).then(res => res.json())
}

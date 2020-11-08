// Example api call:

export const getGraph = async (id) => fetch(`api/graph/${id}`, {
  method: 'GET',
  headers: {}
} ).then(res => res.json())

export const saveGraph = async (id, dehydrated) => {
  const body = {
    urlKey: id,
    dehydrated
  }
  return fetch(`/api/graph`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  } ).then(res => res.json())
}

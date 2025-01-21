// Example api call:

export const getGraph = async (id) => {
  if (process.env.REACT_APP_NEXT_API_RETRIEVE_URL) {
    return fetch(`${process.env.REACT_APP_NEXT_API_RETRIEVE_URL}${id}`, {
      method: "GET",
      headers: {},
    }).then((res) => res.json());
  }
  return fetch(`api/graph/${id}`, {
    method: "GET",
    headers: {},
  }).then((res) => res.json());
};

const oldSave = (id, dehydrated) => {
  const body = {
    urlKey: id,
    dehydrated,
  };
  return fetch(`/api/graph`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
};

const newSave = async (dehydrated) => {
  const data = await fetch(process.env.REACT_APP_NEXT_API_CREATE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dehydrated }),
  }).then((res) => res.json());

  if (process.env.REACT_APP_DISABLE_LEGACY_SAVE) {
    return data;
  }

  return oldSave(data.key, dehydrated);
};

export const saveGraph = async (id, dehydrated) => {
  if (process.env.REACT_APP_NEXT_API_CREATE_URL) {
    return newSave(dehydrated);
  } else {
    return oldSave(id, dehydrated);
  }
};

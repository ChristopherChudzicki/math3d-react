// @flow

type State = {
  versionAtCreation: ?string,
  creationDate: string
}

const initialState: State = {
  versionAtCreation: process.env.REACT_APP_VERSION,
  creationDate: JSON.stringify(new Date())
}

export default function(state: State = initialState) {
  return state
}

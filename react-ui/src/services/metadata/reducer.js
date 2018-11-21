// @flow
import {
  SET_TITLE, typeof setTitle
} from './actions'
import type { ExtractReturn } from 'utils/flow'

type State = {
  versionAtCreation: ?string,
  creationDate: string
}

type Action = ExtractReturn<setTitle>

const initialState: State = {
  title: 'Untitled',
  versionAtCreation: process.env.REACT_APP_VERSION,
  creationDate: JSON.stringify(new Date())
}

export default function(state: State = initialState, action: Action) {
  const { type, payload } = action

  switch (type) {

    case SET_TITLE: {
      const title = payload.title
      return { ...state, title }
    }

    default: {
      return state
    }

  }

}

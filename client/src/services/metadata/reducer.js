// @flow
import {
  SET_CREATION_DATE, typeof setCreationDate,
  SET_TITLE, typeof setTitle
} from './actions'
import type { ExtractReturn } from 'utils/flow'

type State = {
  versionAtCreation: ?string,
  creationDate: string
}

type Action = ExtractReturn<setTitle> | ExtractReturn<setCreationDate>

export const initialState: State = {
  title: 'Untitled',
  versionAtCreation: process.env.REACT_APP_VERSION,
  creationDate: JSON.stringify(new Date())
}

export default function(state: State = initialState, action: Action) {

  switch (action.type) {

    case SET_TITLE: {
      const title = action.payload.title
      return { ...state, title }
    }

    case SET_CREATION_DATE: {
      const creationDate = action.payload.creationDate
      return { ...state, creationDate }
    }

    default: {
      return state
    }

  }

}

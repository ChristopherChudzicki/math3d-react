// import React from 'react' // used by why-did-you-update
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducer.js'
import thunk from 'redux-thunk'
import { enableBatching } from 'redux-batched-actions'

import { makeMockStore } from './mockData'

const initialState = {
  sortableTree: {
    root: ['axes'],
    axes: []
  },
  folders: {
    'axes': {
      description: 'Axes and Grids',
      isCollapsed: false
    }
  }
}
// const initialState = makeMockStore()

const enhancers = []
const middleware = [thunk]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }

  // const { whyDidYouUpdate } = require('why-did-you-update')
  // whyDidYouUpdate(React) // logs potentially unnecessary re-renders

}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  enableBatching(rootReducer),
  initialState,
  composedEnhancers
)

window.store = store
export default store

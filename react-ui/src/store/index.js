// import React from 'react' // used by why-did-you-update
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducer'
import thunk from 'redux-thunk'
import { enableBatching } from 'redux-batched-actions'
import initialState from './initialState'
import { rehydrate } from './hydration'

const enhancers = []
const middleware = [thunk]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

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
  rehydrate(initialState),
  composedEnhancers
)

export default store

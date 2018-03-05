import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducer.js'
import thunk from 'redux-thunk'

import { makeMockStore } from './mockData'

// const initialState = {}
const initialState = makeMockStore()
console.log(initialState)
const enhancers = []
const middleware = [
  thunk
]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
)

export default store

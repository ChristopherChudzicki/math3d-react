import React from 'react'
import store from './store'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

const target = document.querySelector('#root')

render(
  <Provider store={store}>
    <App />
  </Provider>,
  target
)
registerServiceWorker()

import React from 'react'
import store from './store'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'
import { unregister } from './registerServiceWorker'

import MathScopeProvider from './containers/MathScopeContext'
import { scopeEvaluator, parser } from './constants/parsing'

import theme from './constants/theme'
import { ThemeProvider } from 'styled-components'

import { BrowserRouter } from 'react-router-dom'

import ReactGA from 'react-ga'
// TODO: Replace this with redux-beacon middleware
ReactGA.initialize('UA-131928751-1', {
  testMode: process.env.NODE_ENV === 'development'
} )
ReactGA.pageview(window.location.pathname + window.location.search)

// run all the code in mockState
// import './store/mockState'

const target = document.querySelector('#root')

render(
  <Provider store={store}>
    <MathScopeProvider scopeEvaluator={scopeEvaluator} parser={parser}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </MathScopeProvider>
  </Provider>,
  target
)

unregister()

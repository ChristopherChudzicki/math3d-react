import React from 'react'
import store from './store'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import MathScopeProvider from './containers/MathScopeContext'
import { scopeEvaluator, parser } from './constants/parsing'

import theme from './constants/theme'
import { ThemeProvider } from 'styled-components'

// run all the code in mockState
import './store/mockState'

const target = document.querySelector('#root')

render(
  <Provider store={store}>
    <MathScopeProvider scopeEvaluator={scopeEvaluator} parser={parser}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </MathScopeProvider>
  </Provider>,
  target
)
registerServiceWorker()

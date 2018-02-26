import React, { Component } from 'react'
import Header from './components/Header'
import FlexContainer from './components/FlexContainer'

import Math3dController from './views/Math3dController'
import Math3dScene from './views/Math3dScene'
import Examples from './views/Examples'

class App extends Component {

  render() {
    return (
      <FlexContainer style={ { overflow: 'hidden', flexDirection: 'column' } }>
        <Header />
        <FlexContainer>
          <Math3dController />
          <Math3dScene />
          <Examples />
        </FlexContainer>
      </FlexContainer>
    )
  }

}

export default App

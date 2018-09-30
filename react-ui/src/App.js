import React, { Component } from 'react'
import Header from './components/Header'
import FlexContainer from './components/FlexContainer'

import UserControls from './views/UserControls'
import Scene from './views/Scene'
import Examples from './views/Examples'

class App extends Component {

  render() {
    return (
      <FlexContainer style={ { overflow: 'hidden', flexDirection: 'column' } }>
        <Header />
        <FlexContainer>
          <UserControls />
          <Scene />
          <Examples />
        </FlexContainer>
      </FlexContainer>
    )
  }

}

export default App

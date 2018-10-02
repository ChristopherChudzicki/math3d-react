import React, { Component } from 'react'
import FlexContainer from './components/FlexContainer'

import UserControls from './views/UserControls'
import Scene from './views/Scene'
import Examples from './views/Examples'
import Header from './views/Header'

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

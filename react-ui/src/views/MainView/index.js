import React from 'react'
import FlexContainer from 'components/FlexContainer'
import UserControls from './UserControls'
import Scene from './Scene'
import Examples from './Examples'
import Header from './Header'
import { withRouter } from 'react-router-dom'

function MainView(props) {
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

export default withRouter(MainView)

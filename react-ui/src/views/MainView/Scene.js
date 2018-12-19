import React, { PureComponent } from 'react'
import MathBoxContainer from 'containers/MathBoxContainer'
import MathBoxScene from 'containers/MathBoxScene'
import styled from 'styled-components'

const SceneBoundary = styled.div`
  display:flex;
  height:100%;
  overflow: hidden;
  flex: 1;
  z-index:100;
`

export default class Math3dScene extends PureComponent {

  render() {
    return (
      <SceneBoundary>
        <MathBoxContainer mathboxElement={window.mathboxElement}>
          <MathBoxScene />
        </MathBoxContainer>
      </SceneBoundary>
    )
  }

}

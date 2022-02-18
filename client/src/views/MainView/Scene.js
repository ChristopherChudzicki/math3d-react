import React, { PureComponent } from 'react'
import MathBoxContainer from 'containers/MathBoxContainer'
import MathBoxScene from 'containers/MathBoxScene'
import { mathboxElement } from "containers/MathBoxScene/components/MathBoxScene";
import styled from 'styled-components'

const SceneBoundary = styled.div`
  display:flex;
  height:100%;
  overflow: hidden;
  flex: 1;
`

export default class Math3dScene extends PureComponent {

  render() {
    return (
      <SceneBoundary>
        <MathBoxContainer mathboxElement={mathboxElement}>
          <MathBoxScene />
        </MathBoxContainer>
      </SceneBoundary>
    )
  }

}

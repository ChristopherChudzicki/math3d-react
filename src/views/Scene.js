import React, { PureComponent } from 'react'
import FlexContainer from '../components/FlexContainer'
import MathBoxContainer from 'containers/MathBoxContainer'
import MathBoxScene from 'containers/MathBoxScene'

export default class Math3dScene extends PureComponent {

  render() {
    return (
      <FlexContainer style={ { flex: 1 } } >
        <MathBoxContainer mathboxElement={window.mathboxElement}>
          <MathBoxScene />
        </MathBoxContainer>
      </FlexContainer>
    )
  }

}

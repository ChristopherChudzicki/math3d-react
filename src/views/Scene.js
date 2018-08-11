import React, { PureComponent } from 'react'
import FlexContainer from '../components/FlexContainer'
import MathBoxContainer from 'containers/MathBoxContainer'
import MathBoxScene from 'containers/MathBoxScene'

// TODO: This is a connected component. Should we move it into containers?

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

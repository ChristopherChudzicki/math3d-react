import React, { Component } from 'react'
import FlexContainer from '../components/FlexContainer'
import MathBoxContainer from 'containers/MathBoxContainer'
import MathBox, { Point, Grid, Cartesian } from 'components/MathBox/MathBox'

class Math3dScene extends Component {

  state = { z: 0 }

  onClick = () => {
    this.setState( { z: (this.state.z + 1) % 5 } )
  }

  render() {
    return (
      <FlexContainer style={ { flex: 1 } }
        onClick={this.onClick}
      >
        <MathBoxContainer mathboxElement={window.mathboxElement}>
          <MathBox mathbox={window.mathbox}>
            <Cartesian>
              <Grid axes='xy' />
              <Grid axes='yz' />
              <Point
                coords={[0, 0, this.state.z]}
                color='blue'
                size={20}
              />
            </Cartesian>
          </MathBox>
        </MathBoxContainer>
      </FlexContainer>
    )
  }

}

export default Math3dScene

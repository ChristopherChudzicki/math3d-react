import React, { Component } from 'react'
import styled from 'styled-components'
import Header from './components/Header'
import Container from './components/Container'
import Drawer from './containers/Drawer'
import MathQuill from './components/MathQuill'

const StyledMath = styled(MathQuill)`
  color:red;
  border:none;
  &.mq-editable-field.mq-math-mode.mq-focused {
    color:blue
  }
`

class App extends Component {

  state = {
    latex: 'E=mc^2'
  }

  render() {
    return (
      <Container>
        <Header />
        <Container>
          <Drawer id='main'>
            <Container></Container>
          </Drawer>
          <Container>
            <StyledMath
              latex={this.state.latex}
              onEdit = { mq => {
                console.log(mq.latex())
                this.setState( { latex: mq.latex() } )
              }
              }
            />
          </Container>
        </Container>
      </Container>
    )
  }

}

export default App

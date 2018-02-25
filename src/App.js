import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import MathQuill from './components/MathQuill'
import styled from 'styled-components'

const MainMath = styled(MathQuill)`
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
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <MainMath
          latex={this.state.latex}
          onEdit = { mq => {
            console.log(mq.latex())
            this.setState( { latex: mq.latex() } )
          }
          }
        />
      </div>
    )
  }

}

export default App

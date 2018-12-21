import React, { Component } from 'react'
import MainView from './views/MainView'
import { Switch, Route } from 'react-router-dom'

class App extends Component {

  renderGraph( { match } ) {
    return (
      <MainView graphId={match.params.id}/>
    )
  }

  render() {
    // NOTE: I tried path='/load/:graph' for the routes, but got strange errors.
    // This seems to work...
    return (
      <Switch>
        <Route exact path='/:id' render={this.renderGraph}/>
        <Route exact path='/' render={this.renderGraph}/>
      </Switch>
    )
  }

}

export default App

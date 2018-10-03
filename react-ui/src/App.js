import React, { PureComponent } from 'react'
import MainView from './views/MainView'
import { Switch, Route } from 'react-router-dom'

class App extends PureComponent {

  renderGraph( { match } ) {
    return (
      <MainView graphId={match.params.graph}/>
    )
  }

  render() {
    // NOTE: I tried path='/load/:graph' for the routes, but got strange errors.
    // This seems to work...
    return (
      <Switch>
        <Route exact path='/:graph' render={this.renderGraph}/>
        <Route exact path='/' render={this.renderGraph}/>
      </Switch>
    )
  }

}

export default App

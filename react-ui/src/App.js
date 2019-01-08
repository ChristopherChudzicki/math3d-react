import React, { Component } from 'react'
import MainView from './views/MainView'
import { Switch, Route } from 'react-router-dom'
import ReactGA from 'react-ga'

// TODO: Replace this with redux-beacon middleware
ReactGA.initialize('UA-131928751-1', {
  testMode: process.env.NODE_ENV === 'development'
} )
ReactGA.pageview(window.location.pathname + window.location.search)

class App extends Component {

  legacyReRoute( { match } ) {
    // Redirect users to the old site
    window.location = `https://math3d.herokuapp.com/graph/${match.params.id}`
  }

  renderGraph( { match } ) {
    return (
      <MainView graphId={match.params.id}/>
    )
  }

  render() {
    // NOTE: I tried path='/load/:graph' for the routes, but got strange errors
    // that are possibly related to hacky mathbox imports.
    // This seems to work...
    return (
      <Switch>
        <Route exact path='/graph/:id' render={this.legacyReRoute}/>
        <Route exact path='/:id' render={this.renderGraph}/>
        <Route exact path='/' render={this.renderGraph}/>
      </Switch>
    )
  }

}

export default App

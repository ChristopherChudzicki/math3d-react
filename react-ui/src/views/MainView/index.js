// @flow
import React, { PureComponent } from 'react'
import FlexContainer from 'components/FlexContainer'
import UserControls from './UserControls'
import Scene from './Scene'
import Examples from './Examples'
import Header from './Header'
import { loadGraph } from './actions'
import { connect } from 'react-redux'

type Props = {
  loadGraph: (id: string) => Function,
  graphId?: string
}

class MainView extends PureComponent<Props> {

  componentDidMount() {
    if (this.props.graphId) {
      this.props.loadGraph(this.props.graphId)
    }
  }

  render() {
    return <FlexContainer style={ { overflow: 'hidden', flexDirection: 'column' } }>
      <Header />
      <FlexContainer>
        <UserControls />
        <Scene />
        <Examples />
      </FlexContainer>
    </FlexContainer>
  }

}

const mapDispatchToProps = {
  loadGraph: loadGraph
}

export default connect(null, mapDispatchToProps)(MainView)

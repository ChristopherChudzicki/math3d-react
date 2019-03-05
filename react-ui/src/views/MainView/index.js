// @flow
import React, { PureComponent } from 'react'
import FlexContainer from 'components/FlexContainer'
import UserControls from './UserControls'
import Scene from './Scene'
import Examples from './Examples'
import Header from './Header'
import { loadGraphFromDb } from './actions'
import { loadDehydratedState } from 'store/actions'
import initialState from 'store/initialState'
import { connect } from 'react-redux'

type OwnProps = {|
  graphId?: string
|}

type DispatchProps = {|
  loadGraphFromDb: (id: string) => Function,
  loadDehydratedState: (dehydrated: {} ) => void
|}

type Props = {|
  ...DispatchProps,
  ...OwnProps
|}

class MainView extends PureComponent<Props> {

  componentDidMount() {
    if (this.props.graphId) {
      this.props.loadGraphFromDb(this.props.graphId)
    }
  }

  componentDidUpdate() {
    if (this.props.graphId) {
      this.props.loadGraphFromDb(this.props.graphId)
    }
    else {
      this.props.loadDehydratedState(initialState)
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
  loadGraphFromDb,
  loadDehydratedState
}

export default connect<Props, OwnProps, _, _, _, _>(null, mapDispatchToProps)(MainView)

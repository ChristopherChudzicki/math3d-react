// @flow
import * as React from 'react'
import { timeout } from '../../utils/functions'
import LoopManager from '../../services/LoopManager'

type Props = {
  mathbox: any,
  children: React.Node
}

export class MathBox extends React.PureComponent<Props> {

  mathboxNode = this.props.mathbox
  loopManager: LoopManager
  updateSymbol = Symbol('update marker')

  componentDidMount() {
    this.loopManager = new LoopManager(this.mathboxNode.three)
  }

  componentWillUnmount() {
    this.loopManager.unbindEventListeners()
  }

  // handles entering/exiting slow mode
  async componentDidUpdate() {
    const updateSymbol = Symbol('update marker')
    this.updateSymbol = updateSymbol
    this.loopManager.exitSlowMode()

    await timeout(100)
    if (this.updateSymbol === updateSymbol) {
      this.loopManager.enterSlowMode()
    }

  }

  render() {
    if (!this.props.children) {
      return null
    }
    return React.Children.map(
      this.props.children,
      child => React.cloneElement(child, {
        mathboxParent: this.mathboxNode,
        mathbox: this.mathboxNode
      } )
    )
  }

}

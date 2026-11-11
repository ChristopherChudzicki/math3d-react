// @flow
import * as React from 'react'
import { timeout } from 'utils/functions'
import LoopManager from 'services/LoopManager'
import { isFrameMode } from 'legacyAudit/frameMode'

type Props = {
  mathbox: any,
  children: React.Node
}

export class MathBox extends React.PureComponent<Props> {

  mathboxNode = this.props.mathbox
  loopManager: LoopManager
  updateSymbol = Symbol('update marker')

  // Frame mode skips the LoopManager, whose slow mode would restart the loop
  // that renderFrame stops.
  componentDidMount() {
    if (isFrameMode) { return }
    this.loopManager = new LoopManager(this.mathboxNode.three)
  }

  componentWillUnmount() {
    if (isFrameMode) { return }
    this.loopManager.unbindEventListeners()
  }

  // handles entering/exiting slow mode
  async componentDidUpdate() {
    if (isFrameMode) { return }
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

// @flow
import * as React from 'react'
import { timeout } from 'utils/functions'
import { loopManager } from 'constants/animation'

// TODO: Reorganize this

type Props = {
  mathbox: any,
  children: React.Node
}

export class MathBox extends React.PureComponent<Props> {

  mathboxNode = this.props.mathbox

  updateSymbol = Symbol('update marker')

  async componentDidUpdate() {
    const updateSymbol = Symbol('update marker')
    this.updateSymbol = updateSymbol
    loopManager.exitSlowMode()

    await timeout(10)
    if (this.updateSymbol === updateSymbol) {
      loopManager.enterSlowMode()
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

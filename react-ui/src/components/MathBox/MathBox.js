// @flow
import * as React from 'react'
import { timeout } from 'utils/functions'

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
    const Loop = this.mathboxNode.three.Loop
    this.updateSymbol = updateSymbol

    if (!Loop.running) {
      Loop.start()
    }
    await timeout(1000)
    if (this.updateSymbol === updateSymbol) {
      Loop.stop()
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

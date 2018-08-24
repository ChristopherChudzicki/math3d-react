import diff from 'shallow-diff'
import React, { Component } from 'react'

// NOTE: MathBoxComponent is abstract class, the following MUST be implemented:
// handlers
// renderNodeNames
// dataNodeNames
// mathboxRender

// TODO: Document this ... maybe flow?

class MathBoxComponent extends Component {

  oldProps = {}
  oldProps = {}
  diffProps = {
    added: [],
    deleted: [],
    unchanged: [],
    updated: []
  }

  shouldComponentUpdate = (nextProps) => {
    this.oldProps = this.props
    this.diffProps = diff(this.props, nextProps)
    const { added, deleted, updated } = this.diffProps
    return updated.length !== 0 || added.length !== 0 || deleted.length !== 0
  }

  componentDidMount = () => {
    this.mathboxNode = this.mathboxRender(this.props.mathboxParent)
    this.forceUpdate()
    // render method only updates updated props, need to update all on mount
    this.updateHandledProps(this.props)
  }

  componentWillUnmount = () => {
    this.mathboxNode.remove()
  }

  renderChildren = () => {
    if (!this.props.children) {
      return null
    }
    return React.Children.map(
      this.props.children,
      child => React.cloneElement(child, { mathboxParent: this.mathboxNode } )
    )
  }

  render() {
    if (this.mathboxNode) {
      this.mathboxUpdate()
      return this.renderChildren()
    }
    return null
  }

  updateHandledProps(props) {
    const nodes = {
      dataNodes: this.dataNodeNames && this.mathboxNode.select(this.dataNodeNames),
      renderNodes: this.renderNodeNames && this.mathboxNode.select(this.renderNodeNames)
    }
    Object.keys(props).forEach(prop => {
      const handler = this.handlers[prop]
      if (handler) {
        const value = props[prop]
        handler(nodes, value)
      }
    } )
  }

  mathboxUpdate() {
    const differing = [
      ...this.diffProps.updated,
      ...this.diffProps.added
    ].reduce((acc, prop) => {
      acc[prop] = this.props[prop]
      return acc
    }, {} )
    this.updateHandledProps(differing)
  }

}

function makeSetProperty(propName) {
  return ( { renderNodes }, value) => renderNodes.set(propName, value)
}

const universalHandlers = {
  opacity: makeSetProperty('opacity'),
  visible: makeSetProperty('visible'),
  zBias: makeSetProperty('zBias'),
  zIndex: makeSetProperty('zIndex'),
  color: makeSetProperty('color')
}

const lineLikeHandlers = {
  size: makeSetProperty('size'),
  width: makeSetProperty('width'),
  start: makeSetProperty('start'),
  end: makeSetProperty('end')
}

export class Cartesian extends MathBoxComponent {

  dataNodeNames = 'cartesian'
  renderNodeNames = null
  handlers = {}

  mathboxRender = (parent) => {
    const node = parent.cartesian( {
      range: [[-5, 5], [-5, 5], [-5, 5]],
      scale: [2, 2, 1]
    } )
    return node
  }

}

export class Grid extends MathBoxComponent {

  dataNodeNames = null
  renderNodeNames = 'grid'
  handlers = {
    ...universalHandlers
  }

  mathboxRender = (parent) => {
    const node = parent.grid( {
      axes: this.props.axes,
      divideX: 10,
      divideY: 10,
      width: 5,
      opacity: 0.3
    } )
    return node
  }

}

export class Point extends MathBoxComponent {

  dataNodeNames = 'array'
  renderNodeNames = 'point'
  handlers = {
    ...universalHandlers,
    size: makeSetProperty('size'),
    coords: this.handleCoords
  }

  handleCoords( { dataNodes, renderNodes }, value) {
    const data = (value instanceof Array) && (value[0] instanceof Number)
      ? [value]
      : value
    dataNodes.set('data', data)
  }

  mathboxRender = (parent) => {
    const node = parent.group()
    node.array( { items: 1, channels: 3 } )
      .point()

    return node
  }

}

export class Line extends MathBoxComponent {

  dataNodeNames = 'array'
  renderNodeNames = 'line'
  handlers = {
    ...universalHandlers,
    ...lineLikeHandlers,
    coords: this.handleCoords
  }

  handleCoords( { dataNodes, renderNodes }, value) {
    dataNodes.set('data', value)
  }

  mathboxRender = (parent) => {
    const node = parent.group()
    node.array( { items: 1, channels: 3 } )
      .line()

    return node
  }

}

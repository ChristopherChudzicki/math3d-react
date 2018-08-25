// @flow
import diff from 'shallow-diff'
import * as React from 'react'

type MathBoxNode = any

type HandlerNodes = {
  renderNodes: MathBoxNode,
  dataNodes: MathBoxNode,
  mathbox: MathBoxNode
}

type Handler = (nodes: HandlerNodes, value: any) => void

type Props = {
  [string]: any,
  children?: React.Node,
  mathbox?: MathBoxNode, // supplied by parent during render
  mathboxParent?: MathBoxNode, // supplied by parent during render
}

interface MathBoxComponent {
  mathboxRender: (MathBoxNode) => MathBoxNode,
  dataNodeNames: ?Array<string>,
  renderNodeNames: ?Array<string>,
  handlers: {
    [nodeName: string]: Handler
  }
}

class AbstractMBC extends React.Component<Props> {

  mathbox: MathBoxNode // root node
  mathboxNode: MathBoxNode // node for this component
  oldProps = {}
  diffProps = {
    added: [],
    deleted: [],
    unchanged: [],
    updated: []
  }

  shouldComponentUpdate = (nextProps: Props) => {
    this.oldProps = this.props
    this.diffProps = diff(this.props, nextProps)
    const { added, deleted, updated } = this.diffProps
    return updated.length !== 0 || added.length !== 0 || deleted.length !== 0
  }

  componentDidMount = () => {
    if (this.props.mathboxParent) {
      // $FlowFixMe: this.mathboxRender is abstract
      this.mathboxNode = this.mathboxRender(this.props.mathboxParent)
      this.mathbox = this.props.mathbox
    }
    else {
      throw ReferenceError(`${this.constructor.name} called without a 'mathboxParent' property.`)
    }

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
      child => React.cloneElement(child, {
        mathboxParent: this.mathboxNode,
        mathbox: this.mathbox
      } )
    )
  }

  render() {
    if (this.mathboxNode) {
      this.mathboxUpdate()
      return this.renderChildren()
    }
    return null
  }

  getNodes(nodeNames: ?Array<string>) {
    return nodeNames
      ? this.mathboxNode.select(nodeNames.join(', '))
      : undefined
  }

  updateHandledProps(props: Props) {
    const nodes = {
      // $FlowFixMe: this.dataNodeNames is abstract
      dataNodes: this.getNodes(this.dataNodeNames),
      // $FlowFixMe: this.renderNodeNames is abstract
      renderNodes: this.getNodes(this.renderNodeNames),
      mathbox: this.mathbox
    }
    Object.keys(props).forEach(prop => {
      // $FlowFixMe: this.handlers is abstract
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

export class Cartesian extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = ['cartesian']
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

export class Grid extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = null
  renderNodeNames = ['grid']
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

export class Point extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = ['array']
  renderNodeNames = ['point']
  handlers = {
    ...universalHandlers,
    size: makeSetProperty('size'),
    coords: this.handleCoords
  }

  handleCoords(nodes: HandlerNodes, value: any) {
    const data = (value instanceof Array) && (value[0] instanceof Number)
      ? [value]
      : value
    nodes.dataNodes.set('data', data)
  }

  mathboxRender = (parent) => {
    const node = parent.group()
    node.array( { items: 1, channels: 3 } )
      .point()

    return node
  }

}

export class Line extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = ['array']
  renderNodeNames = ['line']
  handlers = {
    ...universalHandlers,
    ...lineLikeHandlers,
    coords: this.handleCoords
  }

  handleCoords(nodes: HandlerNodes, value: any) {
    nodes.dataNodes.set('data', value)
  }

  mathboxRender = (parent) => {
    const node = parent.group()
    node.array( { items: 1, channels: 3 } )
      .line()

    return node
  }

}

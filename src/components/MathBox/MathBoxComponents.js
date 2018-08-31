// @flow
import * as React from 'react'
import math from 'utils/mathjs'
import { isEqualNumerically, validateNumeric, validateVector, isVector } from './helpers'
import diffWithSets from 'utils/shallowDiffWithSets'

type MathBoxNode = any

type HandlerNodes = {
  renderNodes: MathBoxNode,
  dataNodes: MathBoxNode,
  groupNode: MathBoxNode
}

type Handler = (nodes: HandlerNodes, handledProps: any) => void

export type HandledProps = {
  [string]: any,
}

type ErrorMap = {
  [string]: Error
}

export type Props = HandledProps & {
  id: string,
  children?: React.Node,
  mathbox?: MathBoxNode, // supplied by parent during render
  mathboxParent?: MathBoxNode, // supplied by parent during render
  handleErrors: (errors: ErrorMap, props: Props, updatedProps: HandledProps) => void
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
  diffProps : {
    added: Set<string>,
    deleted: Set<string>,
    unchanged: Set<string>,
    updated: Set<string>
  } = {
    added: new Set(),
    deleted: new Set(),
    unchanged: new Set(),
    updated: new Set()
  }

  static defaultProps = {
    handleErrors: AbstractMBC.defaultHandleErrors
  }

  shouldComponentUpdate = (nextProps: Props) => {
    this.oldProps = this.props
    this.diffProps = diffWithSets(this.props, nextProps)
    const { added, deleted, updated, unchanged } = this.diffProps
    for (const prop of updated) {
      if (isEqualNumerically(this.oldProps[prop], nextProps[prop] )) {
        updated.delete(prop)
        unchanged.add(prop)
      }
    }

    return updated.size !== 0 || added.size !== 0 || deleted.size !== 0
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
      return this.renderChildren()
    }
    return null
  }

  getNodes(nodeNames: ?Array<string>) {
    return nodeNames
      ? this.mathboxNode.select(nodeNames.join(', '))
      : undefined
  }

  getHandledProps() {
    // $FlowFixMe: this.handlers is abstract
    return Object.keys(this.handlers)
      .reduce((acc, propName) => {
        acc[propName] = this.props[propName]
        return acc
      }, {} )
  }

  updateHandledProps(propsToUpdate: HandledProps) {
    const nodes = {
      // $FlowFixMe: this.dataNodeNames is abstract
      dataNodes: this.getNodes(this.dataNodeNames),
      // $FlowFixMe: this.renderNodeNames is abstract
      renderNodes: this.getNodes(this.renderNodeNames),
      groupNode: this.mathboxNode
    }
    const handledProps = this.getHandledProps()

    const errors = {}
    Object.keys(propsToUpdate).forEach(prop => {
      // $FlowFixMe: this.handlers is abstract
      const handler = this.handlers[prop]
      if (handler) {
        try {
          handler(nodes, handledProps)
        }
        catch (error) {
          errors[prop] = error
        }
      }
    } )

    this.props.handleErrors(errors, this.props, propsToUpdate)

  }

  static defaultHandleErrors(errors: ErrorMap) {
    if (Object.keys(errors).length === 0) {
      return
    }
    console.group('Errors caught while trying to re-render:')
    Object.keys(errors).forEach(propName => {
      console.warn(errors[propName] )
    } )
    console.groupEnd()
  }

  componentDidUpdate() {
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
  return ( { renderNodes }, handledProps) => renderNodes.set(propName, handledProps[propName] )
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

export class Axis extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = null
  renderNodeNames = ['axis']
  handlers = {
    ...universalHandlers,
    min: Axis.handleMin,
    max: Axis.handleMax,
    axis: Axis.handleAxis
  }

  static handleAxis(nodes: HandlerNodes, handledProps: HandledProps) {
    const { axis } = handledProps
    nodes.renderNodes.set('axis', axis)
  }

  static handleMin(nodes: HandlerNodes, handledProps: HandledProps) {
    const { min, axis } = handledProps
    validateNumeric(min)
    const cartesian = Axis.getCartesian(nodes.renderNodes)
    Axis.setAxisEnd(cartesian, axis, min, 0)
  }

  static handleMax(nodes: HandlerNodes, handledProps: HandledProps) {
    const { max, axis } = handledProps
    validateNumeric(max)
    const cartesian = Axis.getCartesian(nodes.renderNodes)
    Axis.setAxisEnd(cartesian, axis, max, 1)
  }

  static copyCartesianRange(cartesian: MathBoxNode) {
    const range = cartesian.props.range // this is a THREE.vec4 object
    return [
      [range[0].x, range[0].y],
      [range[1].x, range[1].y],
      [range[2].x, range[2].y]
    ]
  }

  static axisMap = { 'x': 0, 'y': 1, 'z': 2 }
  static setAxisEnd(cartesian: MathBoxNode, axis: 'x' | 'y' | 'z', value: number, endIndex: 0 | 1) {
    const cartesianRange = Axis.copyCartesianRange(cartesian)
    const axisIndex = Axis.axisMap[axis]
    cartesianRange[axisIndex][endIndex] = value
    cartesian.set('range', cartesianRange)
  }

  static getCartesian(axisNode: MathBoxNode) {
    let currentNode = axisNode[0]
    while (currentNode.type !== 'cartesian') {
      currentNode = currentNode.parent
      if (currentNode.type === 'root') {
        throw Error("Node type 'axis' should have 'cartesian' as an ancestor.")
      }
    }
    return currentNode
  }

  mathboxRender = (parent) => {
    const node = parent.group()
    node.axis()
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
    coords: Point.handleCoords
  }

  static handleCoords(nodes: HandlerNodes, handledProps: any) {
    const coords = handledProps.coords
    const data = (coords instanceof Array) && (coords[0] instanceof Number)
      ? [coords]
      : coords
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
    coords: Line.handleCoords
  }

  static handleCoords(nodes: HandlerNodes, handledProps: any) {
    nodes.dataNodes.set('data', handledProps.coords)
  }

  mathboxRender = (parent) => {
    const node = parent.group()
    node.array( { items: 1, channels: 3 } )
      .line()

    return node
  }

}

export class Vector extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = ['array']
  renderNodeNames = ['line']
  handlers = {
    ...universalHandlers,
    ...lineLikeHandlers,
    components: Vector.handleComponents,
    tail: Vector.handleTail
  }

  static handleTail(nodes: HandlerNodes, handledProps: HandledProps) {
    const { tail, components } = handledProps
    validateVector(tail, 3)
    if (isVector(components, 3)) {
      Vector.updateData(nodes, handledProps)
    }
  }

  static handleComponents(nodes: HandlerNodes, handledProps: HandledProps) {
    const { tail, components } = handledProps
    validateVector(components, 3)
    if (isVector(tail, 3)) {
      Vector.updateData(nodes, handledProps)
    }
  }

  static updateData(nodes: HandlerNodes, handledProps: HandledProps) {
    const { tail, components } = handledProps
    const head = math.add(tail, components)
    nodes.dataNodes.set('data', [tail, head] )
  }

  mathboxRender = (parent) => {
    const node = parent.group()
    node.array( { items: 1, channels: 3 } )
      .line()

    return node
  }

}

export class ParametricCurve extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = ['interval']
  renderNodeNames = ['line']
  handlers = {
    ...universalHandlers,
    ...lineLikeHandlers,
    range: ParametricCurve.handleRange,
    expr: ParametricCurve.handleExpr,
    samples: ParametricCurve.handleSamples
  }

  static handleRange(nodes: HandlerNodes, handledProps: HandledProps) {
    const { range } = handledProps
    validateVector(range, 2)
    const cartesian = nodes.groupNode.select('cartesian')
    cartesian.set('range', [range, [0, 1]] )
  }

  static handleExpr(nodes: HandlerNodes, handledProps: HandledProps) {
    const { expr } = handledProps
    nodes.dataNodes.set('expr', (emit, t) => {
      return emit(...expr(t))
    } )
  }

  static handleSamples(nodes: HandlerNodes, handledProps: HandledProps) {
    const { samples } = handledProps
    nodes.dataNodes.set('width', samples)
  }

  mathboxRender = (parent) => {
    // NOTE: Updating an <interval>'s range does not work. However, it does work
    // to make interval a child of its own <cartesian>, inherit range from
    // \cartesian, and update <cartesian>'s range. See
    // https://groups.google.com/forum/?fromgroups#!topic/mathbox/zLX6WJjTDZk

    const group = parent.group()
    const data = group.cartesian().interval( {
      channels: 3,
      axis: 1,
      live: false
    } )

    group.line( {
      points: data
    } )

    return group
  }

}

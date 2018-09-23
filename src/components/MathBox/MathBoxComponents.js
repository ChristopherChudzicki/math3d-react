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
  return ( { renderNodes }: HandlerNodes, handledProps: HandledProps) => {
    return renderNodes.set(propName, handledProps[propName] )
  }
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

function makeHandleLabel(dataOffset) {
  return (nodes: HandlerNodes, handledProps: HandledProps) => {
    const data = [...Array(dataOffset).fill(''), handledProps.label]
    nodes.groupNode.select('format.label').set('data', data)
  }
}

function handleLabelVisible(nodes: HandlerNodes, handledProps: HandledProps) {
  nodes.groupNode.select('label.label').set('visible', handledProps.labelVisible)
}

export class Camera extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = ['camera']
  renderNodeNames = null
  handlers = {}

  mathboxRender = (parent) => {
    const node = parent.camera( {
      position: [-3/2, -3/4, 1/4],
      proxy: true
    } )
    return node
  }

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

function vec3ToArray(vec3Object: { x?: number, y?: number, z?: number } ) {
  const { x = 0, y = 0, z = 0 } = vec3Object
  return [x, y, z]
}

export class Axis extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = null
  renderNodeNames = ['axis']
  handlers = {
    ...universalHandlers,
    label: Axis.handleLabel,
    labelVisible: handleLabelVisible,
    min: Axis.handleMin,
    max: Axis.handleMax,
    axis: Axis.handleAxis,
    scale: Axis.handleScale
  }

  static handleLabel(nodes: HandlerNodes, handledProps: HandledProps) {
    nodes.groupNode.select('.label text').set('data', [handledProps.label] )
  }

  static handleScale(nodes: HandlerNodes, handledProps: HandledProps) {
    const { scale, axis } = handledProps
    validateNumeric(scale)
    const cartesian = Axis.getCartesian(nodes.renderNodes)
    const scaleCopy = { ...cartesian.props.scale }
    scaleCopy[axis] = scale
    cartesian.set('scale', scaleCopy)
  }

  static handleAxis(nodes: HandlerNodes, handledProps: HandledProps) {
    const { axis } = handledProps
    nodes.renderNodes.set('axis', axis)
    nodes.groupNode.select('scale').set('axis', axis)
    if (axis === 'z') {
      nodes.groupNode.select('.ticks > label').set('offset', [20, 0, 0] )
    }
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

    const labelPosition = vec3ToArray( { [axis]: max } )
    nodes.groupNode.select('.label > array').set('data', [labelPosition] )
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
    const node = parent.group( { classes: ['axis'] } )
    node.axis()
      .scale( {
        divide: 10,
        nice: true,
        zero: false
      } )

    node.group( { classes: ['ticks'] } )
      .ticks( { width: 2 } )
      .format( { digits: 2 } )
      .label( { classes: ['tick-labels'] } )

    node.group( { classes: ['label'] } )
      .array( { channels: 3, live: false } )
      .text( { weight: 'bold' } )
      .label( { offset: [0, 40, 0] } )

    return node
  }

}

export class Grid extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = null
  renderNodeNames = ['grid']
  handlers = {
    ...universalHandlers,
    axes: Grid.handleAxes,
    width: Grid.handleWidth,
    divisions: Grid.handleDivisions,
    snap: Grid.handleSnap
  }

  static handleAxes = makeSetProperty('axes')
  static handleWidth = makeSetProperty('width')
  static handleDivisions(nodes: HandlerNodes, handledProps: HandledProps) {
    const divisions = handledProps.divisions
    validateVector(divisions, 2)
    nodes.renderNodes.set( {
      divideX: divisions[0],
      divideY: divisions[1]
    } )
  }
  static handleSnap(nodes: HandlerNodes, handledProps: HandledProps) {
    nodes.renderNodes.set( {
      niceX: handledProps.snap,
      niceY: handledProps.snap
    } )
  }

  mathboxRender = (parent) => {
    const node = parent.group()
    node.grid()
    return node
  }

}

export class Point extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = ['array']
  renderNodeNames = ['point']
  handlers = {
    ...universalHandlers,
    label: makeHandleLabel(0),
    labelVisible: handleLabelVisible,
    size: makeSetProperty('size'),
    coords: Point.handleCoords
  }

  static handleCoords(nodes: HandlerNodes, handledProps: HandledProps) {
    const coords = handledProps.coords
    const data = (coords instanceof Array) && (coords[0] instanceof Number)
      ? [coords]
      : coords
    nodes.dataNodes.set('data', data)
  }

  mathboxRender = (parent) => {
    const node = parent.group( { classes: ['point'] } )
    node.array( { items: 1, channels: 3 } )
      .point()
      .format( { classes: ['label'], weight: 'bold' } )
      .label( { classes: ['label'], offset: [0, 40, 0] } )

    return node
  }

}

export class Line extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = ['array']
  renderNodeNames = ['line']
  handlers = {
    ...universalHandlers,
    ...lineLikeHandlers,
    label: makeHandleLabel(1),
    labelVisible: handleLabelVisible,
    coords: Line.handleCoords
  }

  static handleCoords(nodes: HandlerNodes, handledProps: any) {
    nodes.dataNodes.set('data', handledProps.coords)
  }

  mathboxRender = (parent) => {
    const node = parent.group( { classes: ['line'] } )
    node.array( { items: 1, channels: 3 } )
      .line()
      .format( { classes: ['label'], weight: 'bold' } )
      .label( { classes: ['label'], offset: [0, 40, 0] } )

    return node
  }

}

export class Vector extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = ['array']
  renderNodeNames = ['line']
  handlers = {
    ...universalHandlers,
    ...lineLikeHandlers,
    label: makeHandleLabel(1),
    labelVisible: handleLabelVisible,
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
    const node = parent.group( { classes: ['vector'] } )
    node.array( { items: 1, channels: 3 } )
      .line()
      .format( { classes: ['label'], weight: 'bold' } )
      .label( { classes: ['label'], offset: [0, 40, 0] } )

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

// @flow
import * as React from 'react'
import math from 'utils/mathjs'
import {
  validateBoolean,
  isEqualNumerically,
  validateNumeric,
  validateVector,
  isVector,
  validateFunctionSignature
} from './helpers'
import diffWithSets from 'utils/shallowDiffWithSets'

type MathBoxNode = any

type HandlerNodes = {
  renderNodes: MathBoxNode,
  dataNodes: MathBoxNode,
  groupNode: MathBoxNode
}

export type HandledProps = {
  [string]: any,
}

type Handler = (nodes: HandlerNodes, props: HandledProps) => void

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

    const errors = {}
    Object.keys(propsToUpdate).forEach(prop => {
      // $FlowFixMe: this.handlers is abstract
      const handler = this.handlers[prop]
      if (handler) {
        try {
          console.log(handler.name)
          handler(nodes, this.props)
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
    Object.keys(errors).forEach(propName => {
      console.warn(errors[propName] )
    } )
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

function makeSetProperty(propName, validator: ?Function) {
  return ( { renderNodes }: HandlerNodes, handledProps: HandledProps) => {
    if (validator) {
      validator(handledProps[propName] )
    }
    return renderNodes.set(propName, handledProps[propName] )
  }
}

// NOTE: For now, only validating math inputs.

const universalHandlers = {
  opacity: makeSetProperty('opacity', validateNumeric),
  zBias: makeSetProperty('zBias', validateNumeric),
  zIndex: makeSetProperty('zIndex', validateNumeric),
  color: makeSetProperty('color'),
  calculatedVisibility: function(nodes: HandlerNodes, props: Props) {
    const { calculatedVisibility, useCalculatedVisibility } = props
    if (useCalculatedVisibility) {
      validateBoolean(calculatedVisibility)
      nodes.renderNodes.set('visible', calculatedVisibility)
    }
  },
  visible: function(nodes: HandlerNodes, props: Props) {
    if (!props.useCalculatedVisibility) {
      nodes.renderNodes.set('visible', props.visible)
    }
  }
}

const lineLikeHandlers = {
  size: makeSetProperty('size', validateNumeric),
  width: makeSetProperty('width', validateNumeric),
  start: makeSetProperty('start'),
  end: makeSetProperty('end')
}

const surfaceHandlers = {
  shaded: makeSetProperty('shaded')
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
    // not using lineLikeHandlers because axis doesn't have start/end.
    width: makeSetProperty('width'),
    size: makeSetProperty('size'),
    // now the rest
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
    validateVector(tail, 3) // throws error if tail invalid

    // If head is valid, finish updating. If head is not valid:
    //    1. don't update, but...
    //    2. do not throw error. it's not the tail's fault!
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

    ParametricCurve.forceUpdate(nodes, handledProps)
  }

  static handleExpr(nodes: HandlerNodes, handledProps: HandledProps) {
    const { expr } = handledProps
    validateFunctionSignature(expr, 1, 3)
    nodes.dataNodes.set('expr', (emit, t) => {
      return emit(...expr(t))
    } )
  }

  static handleSamples(nodes: HandlerNodes, handledProps: HandledProps) {
    const { samples } = handledProps
    validateNumeric(samples)
    nodes.dataNodes.set('width', samples)
  }

  // This method is a hacky way to force the interval data primitive to update.
  static forceUpdate(nodes: HandlerNodes, handledProps: HandledProps) {
    try {
      ParametricCurve.handleExpr(nodes, handledProps)
    }
    catch (err) {
      // don't do anything with the error; it should have been caught when
      // handleExpr was called directly.
    }
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

export class ParametricSurface extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = ['area']
  renderNodeNames = ['surface']
  handlers = {
    ...universalHandlers,
    ...surfaceHandlers,
    expr: ParametricSurface.handleExpr,
    uRange: ParametricSurface.handleURange,
    vRange: ParametricSurface.handleVRange,
    uSamples: ParametricSurface.handleUSamples,
    vSamples: ParametricSurface.handleVSamples
    // gridColor
    // gridOpacity
    // gridU
    // gridV
  }

  static handleUSamples(nodes: HandlerNodes, handledProps: HandledProps) {
    const { dataNodes } = nodes
    const { uSamples } = handledProps
    validateNumeric(uSamples)
    dataNodes.set('width', uSamples)
  }

  static handleVSamples(nodes: HandlerNodes, handledProps: HandledProps) {
    const { dataNodes } = nodes
    const { vSamples } = handledProps
    validateNumeric(vSamples)
    dataNodes.set('height', vSamples)
  }

  static handleURange(nodes: HandlerNodes, handledProps: HandledProps) {
    const { uRange, vRange } = handledProps
    validateVector(uRange, 2)
    if (isVector(vRange, 2)) {
      ParametricSurface.updateRange(nodes, handledProps)
    }
  }

  static handleVRange(nodes: HandlerNodes, handledProps: HandledProps) {
    const { uRange, vRange } = handledProps
    validateVector(vRange, 2)
    if (isVector(uRange, 2)) {
      ParametricSurface.updateRange(nodes, handledProps)
    }
  }

  static updateRange(nodes: HandlerNodes, handledProps: HandledProps) {
    const { uRange, vRange } = handledProps

    const cartesian = nodes.groupNode.select('cartesian')
    cartesian.set('range', [uRange, vRange] )
    ParametricSurface.forceUpdate(nodes, handledProps)
  }

  static handleExpr(nodes: HandlerNodes, handledProps: HandledProps) {
    const { expr } = handledProps
    validateFunctionSignature(expr, 2, 3)
    nodes.dataNodes.set('expr', (emit, u, v) => {
      return emit(...expr(u, v))
    } )
  }

  // This method is a hacky way to force the interval data primitive to update.
  static forceUpdate(nodes: HandlerNodes, handledProps: HandledProps) {
    try {
      ParametricSurface.handleExpr(nodes, handledProps)
    }
    catch (err) {
      // don't do anything with the error; it should have been caught when
      // handleExpr was called directly.
    }
  }

  mathboxRender = (parent) => {

    const group = parent.group()

    const data = group.cartesian()
      .area( {
        channels: 3,
        axes: [1, 2],
        live: false
      } )

    group
      .surface( {
        points: data
      } ).group().set('classes', ['gridV'] )
      .resample( {
        height: 8, // this.settings.gridV,
        source: data
      } )
      .line()
      .end()
      .group().set('classes', ['gridU'] )
      .resample( {
        width: 8, // this.settings.gridU,
        source: data
      } )
      .transpose( { order: 'yx' } )
      .line()
      .end()

    return group
  }

}

export class ImplicitSurface extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = ['array']
  renderNodeNames = ['strip']
  handlers = {
    ...universalHandlers,
    shaded: makeSetProperty('shaded'),
    lhs: ImplicitSurface.handleLHS,
    rhs: ImplicitSurface.handleRHS
  }

  // @jason The two methods handleLHS and handleRHS will probably be almost the
  // same. Both methods need recalculate the implicit surface data and update
  // mathbox.
  // The difference is that:
  //    handleLHS should throw error if LHS is invalid, but not if RHS is invalid.
  //    handleRHS should throw error if RHS is invalid, but not if LHS is invalid.
  //
  // See Vector class handleTail method for example of how I implemented this.
  //
  // @Jason BUT: feel free not to worry too much about the validation business at first.
  static handleLHS(nodes: HandlerNodes, handledProps: HandledProps) {
    // get lhs and rhs from handledProps
    const { lhs, rhs } = handledProps
    // get the nodes you want, determined by class properties above
    // You probably don't need renderNodes for this method, but I included it
    const { renderNodes, dataNodes } = nodes
  }

  // @jason this method should be almost 100% the same as handleLHS
  // but possibly validate differently
  static handleRHS(nodes: HandlerNodes, handledProps: HandledProps) {

  }

  // @jason feel free to not implement this yet.
  static handleSamples(nodes: HandlerNodes, handledProps: HandledProps) {
    const { samples } = handledProps
  }

  mathboxRender = (parent) => {

    // @jason put all of the implicit-surface related MathBox code inside a
    // group. This function MUST return the group.
    const group = parent.group()

    group.array()
    group.strip()

    return group
  }

}

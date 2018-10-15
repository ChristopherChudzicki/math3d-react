// @flow
import * as React from 'react'
import math from 'utils/mathjs'
import {
  validateBoolean,
  isEqualNumerically,
  validateNumeric,
  validateVector,
  isVector,
  validateFunctionSignature,
  hasFunctionSignature
} from './helpers'
import diffWithSets from 'utils/shallowDiffWithSets'
import { lighten } from 'utils/colors'
import marchingCubes from 'utils/marchingCubes'

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
          // console.log(`Running handler ${handler.name}`)
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
    scale: Axis.handleScale,
    ticksVisible: Axis.handleTicksVisible
  }

  static handleTicksVisible(nodes: HandlerNodes, handledProps: HandledProps) {
    const { groupNode } = nodes
    const { ticksVisible } = handledProps
    groupNode.select('.ticks').set('visible', ticksVisible)
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

  static dataNodeNames = ['area']
  static renderNodeNames = ['surface']
  static handlers = {
    ...universalHandlers,
    ...surfaceHandlers,
    color: ParametricSurface.handleColor,
    expr: ParametricSurface.handleExpr,
    uRange: ParametricSurface.handleRange,
    vRange: ParametricSurface.handleRange,
    uSamples: ParametricSurface.handleUSamples,
    vSamples: ParametricSurface.handleVSamples,
    // gridColor
    gridWidth: ParametricSurface.handleGridWidth,
    gridOpacity: ParametricSurface.handleGridOpacity,
    gridU: ParametricSurface.handleGridU,
    gridV: ParametricSurface.handleGridV
  }

  // TODO: delete this, and change these properties to statics on all
  // MathBoxComponents
  dataNodeNames = ParametricSurface.dataNodeNames
  renderNodeNames = ParametricSurface.renderNodeNames
  handlers = ParametricSurface.handlers

  static handleColor(nodes: HandlerNodes, handledProps: HandledProps) {
    const { color } = handledProps
    const { renderNodes, groupNode } = nodes
    renderNodes.set('color', color)

    const lineColor = lighten(color, -0.75)
    groupNode.select('line').set('color', lineColor)
  }

  static handleGridOpacity(nodes: HandlerNodes, handledProps: HandledProps) {
    const { gridOpacity } = handledProps
    const { groupNode } = nodes
    validateNumeric(gridOpacity)
    groupNode.select('line').set('opacity', gridOpacity)
  }

  static handleGridWidth(nodes: HandlerNodes, handledProps: HandledProps) {
    const { gridWidth } = handledProps
    const { groupNode } = nodes
    validateNumeric(gridWidth)
    groupNode.select('line').set('width', gridWidth)
  }

  static handleGridU(nodes: HandlerNodes, handledProps: HandledProps) {
    const { gridU } = handledProps
    validateNumeric(gridU)
    nodes.groupNode.select('.gridU resample').set('width', gridU)
  }
  static handleGridV(nodes: HandlerNodes, handledProps: HandledProps) {
    const { gridV } = handledProps
    validateNumeric(gridV)
    nodes.groupNode.select('.gridV resample').set('height', gridV)
  }

  static rerender(groupNode: MathBoxNode, handledProps: HandledProps) {
    groupNode.select('area, surface, .gridU, .gridV').remove()
    ParametricSurface.renderParametricSurface(groupNode)
    const newNodes = {
      groupNode,
      dataNodes: groupNode.select(ParametricSurface.dataNodeNames.join(', ')),
      renderNodes: groupNode.select(ParametricSurface.renderNodeNames.join(', '))
    }
    Object.keys(ParametricSurface.handlers).forEach(key => {
      ParametricSurface.handlers[key](newNodes, handledProps)
    } )
  }
  static handleUSamples(nodes: HandlerNodes, handledProps: HandledProps) {
    const { groupNode } = nodes
    const { uSamples } = handledProps
    validateNumeric(uSamples)
    const area = groupNode.select('area')
    if (area.get('width') === null) {
      area.set('width', uSamples)
    }
    else {
      ParametricSurface.rerender(groupNode, handledProps)
    }
  }

  static handleVSamples(nodes: HandlerNodes, handledProps: HandledProps) {
    const { groupNode } = nodes
    const { vSamples } = handledProps
    validateNumeric(vSamples)
    const area = groupNode.select('area')
    if (area.get('height') === null) {
      area.set('height', vSamples)
    }
    else {
      ParametricSurface.rerender(groupNode, handledProps)
    }
  }
  // The next two handlers all perform validation, then delegate to updateExpr
  static handleRange(nodes: HandlerNodes, handledProps: HandledProps) {
    const { uRange, vRange, expr } = handledProps
    const { dataNodes: area } = nodes

    const isRangeValid = ParametricSurface.isRangeValid(uRange, vRange)
    const isExprValid = hasFunctionSignature(expr, 2, 3)
    if (isRangeValid && isExprValid) {
      ParametricSurface.updateExpr(area, uRange, vRange, expr)
    }
    else if (!isRangeValid) {
      if (typeof uRange === 'function' && typeof vRange === 'function') {
        throw new Error('Either the u-range can depend on v, OR the v-range can dependent on u, but NOT both.')
      }
      else {
        throw new Error(`Parameter ranges must be 2-component arrays.`)
      }
    }

  }

  static isRangeValid(uRange: mixed, vRange: mixed) {
    if (isVector(uRange, 2) && isVector(vRange, 2)) {
      return true
    }
    else if (hasFunctionSignature(uRange, 1, 2) && isVector(vRange, 2)) {
      return true
    }

    else if (isVector(uRange, 2) && hasFunctionSignature(vRange, 1, 2)) {
      return true
    }
    else {
      return false
    }
  }

  static handleExpr(nodes: HandlerNodes, handledProps: HandledProps) {
    const { expr, uRange, vRange } = handledProps
    const { dataNodes: area } = nodes
    validateFunctionSignature(expr, 2, 3)
    const isRangeValid = ParametricSurface.isRangeValid(uRange, vRange)

    // Already know expr is valid
    if (isRangeValid) {
      ParametricSurface.updateExpr(area, uRange, vRange, expr)
    }
  }

  // assumes expr, uRange, vRange all valid
  static updateExpr(
    area: MathBoxNode,
    uRange: [number, number] | (number) => [number, number],
    vRange: [number, number] | (number) => [number, number],
    expr: (number, number) => [number, number, number]
  ) {
    // Cases
    if (Array.isArray(uRange) && Array.isArray(vRange)) {
      area.set('expr', (emit, u, v) => {
        const du = uRange
        const dv = vRange
        const trueU = du[0] + u*(du[1] - du[0] )
        const trueV = dv[0] + v*(dv[1] - dv[0] )
        return emit(...expr(trueU, trueV))
      } )
    }
    else if (Array.isArray(uRange) && typeof vRange === 'function') {
      area.set('expr', (emit, u, v) => {
        const du = uRange
        const trueU = du[0] + u*(du[1] - du[0] )
        // $FlowFixMe
        const dv = vRange(trueU)
        const trueV = dv[0] + v*(dv[1] - dv[0] )
        return emit(...expr(trueU, trueV))
      } )
    }
    else if (Array.isArray(vRange) && typeof uRange === 'function') {
      area.set('expr', (emit, u, v) => {
        const dv = vRange
        const trueV = dv[0] + v*(dv[1] - dv[0] )
        // $FlowFixMe
        const du = uRange(trueV)
        const trueU = du[0] + u*(du[1] - du[0] )
        return emit(...expr(trueU, trueV))
      } )
    }
    else {
      throw new Error(`Expected vRange and uRange to be (1) array, array (2)
                       array, function, or (3) function array. Instead, found
                       ${typeof uRange} and ${typeof vRange}`)
    }

  }

  mathboxRender = (parent) => {

    const group = parent.group()

    return ParametricSurface.renderParametricSurface(group)
  }

  static renderParametricSurface(group: MathBoxNode) {
    const data = group.area( {
      channels: 3,
      axes: [1, 2],
      live: false,
      rangeX: [0, 1],
      rangeY: [0, 1]
    } )

    group
      .surface( { points: data } )
      .group( { classes: ['gridV'] } )
      .resample( { source: data } )
      .line()
      .end()
      .group( { classes: 'gridU' } )
      .resample( { source: data } )
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
    rhs: ImplicitSurface.handleRHS,
    xRange: ImplicitSurface.handleXRange,
    yRange: ImplicitSurface.handleYRange,
    zRange: ImplicitSurface.handleZRange,
    samples: ImplicitSurface.handleSamples
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
    const { lhs } = handledProps
    validateFunctionSignature(lhs, 3, 1)
    ImplicitSurface.updateData(nodes, handledProps)
  }

  // @jason this method should be almost 100% the same as handleLHS
  // but possibly validate differently
  static handleRHS(nodes: HandlerNodes, handledProps: HandledProps) {
    const { rhs } = handledProps
    validateFunctionSignature(rhs, 3, 1)
    ImplicitSurface.updateData(nodes, handledProps)
  }

  static handleXRange(nodes: HandlerNodes, handledProps: HandledProps) {
    const { xRange } = handledProps
    validateVector(xRange, 2)
    ImplicitSurface.updateData(nodes, handledProps)
  }

  static handleYRange(nodes: HandlerNodes, handledProps: HandledProps) {
    const { yRange } = handledProps
    validateVector(yRange, 2)
    ImplicitSurface.updateData(nodes, handledProps)
  }

  static handleZRange(nodes: HandlerNodes, handledProps: HandledProps) {
    const { zRange } = handledProps
    validateVector(zRange, 2)
    ImplicitSurface.updateData(nodes, handledProps)
  }

  static updateData(nodes: HandlerNodes, handledProps: HandledProps) {
    const { lhs, rhs, xRange, yRange, zRange, samples } = handledProps
    const { dataNodes } = nodes

    const implicitFunc = (x, y, z) => lhs(x, y, z) - rhs(x, y, z)
    const implicitTriangles = marchingCubes(xRange[0], xRange[1], yRange[0], yRange[1],
                                            zRange[0], zRange[1], implicitFunc, 0, samples)
    dataNodes.set('data', implicitTriangles)
    dataNodes.set('width', implicitTriangles.length)
}

  // @jason feel free to not implement this yet.
  static handleSamples(nodes: HandlerNodes, handledProps: HandledProps) {
    const { samples } = handledProps
    validateNumeric(samples)
    if (samples < 2) {
      throw new Error('Samples needs to be greater than 1')
    }
    if (samples > 50) {
      throw new Error('Samples shouldn\'t be greater than 50')
    }
    ImplicitSurface.updateData(nodes, handledProps)
  }

  mathboxRender = (parent) => {

    // @jason put all of the implicit-surface related MathBox code inside a
    // group. This function MUST return the group.
    const group = parent.group()

    // Array stores a list of the points of the triangles
    // Use strip to render them
    group.array( {
      channels: 3,
      items: 3,
      width: 0,
      live: false
    } ).strip()

    return group
  }

}

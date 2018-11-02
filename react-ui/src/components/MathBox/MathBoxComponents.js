// @flow
import * as React from 'react'
import math from 'utils/mathjs'
import {
  validateBoolean,
  isEqualNumerically,
  isNumeric,
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

type Handler = (nodes: HandlerNodes, props: HandledProps, handlers: { [string]: Handler } ) => void
type Handlers = { [string]: Handler }

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
  handlers: Handlers
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
          console.log(`Running handler ${handler.name}`)
          // $FlowFixMe: this.handlers is abstract
          handler(nodes, this.props, this.handlers)
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

  dataNodeNames = ['area']
  renderNodeNames = ['surface']
  handlers = {
    ...universalHandlers,
    ...surfaceHandlers,
    color: ParametricSurface.handleColor,
    expr: ParametricSurface.handleExpr,
    rangeU: ParametricSurface.handleRange,
    rangeV: ParametricSurface.handleRange,
    uSamples: ParametricSurface.handleUSamples,
    vSamples: ParametricSurface.handleVSamples,
    // gridColor
    gridWidth: ParametricSurface.handleGridWidth,
    gridOpacity: ParametricSurface.handleGridOpacity,
    gridU: ParametricSurface.handleGridU,
    gridV: ParametricSurface.handleGridV
  }

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

  static handleUSamples(nodes: HandlerNodes, handledProps: HandledProps, handlers: Handlers) {
    const { groupNode } = nodes
    const { uSamples } = handledProps
    validateNumeric(uSamples)
    const area = groupNode.select('area')
    if (area.get('width') === null) {
      area.set('width', uSamples)
    }
    else {
      ParametricSurface.rerender(groupNode, handledProps, handlers)
    }
  }

  static handleVSamples(nodes: HandlerNodes, handledProps: HandledProps, handlers: Handlers) {
    const { groupNode } = nodes
    const { vSamples } = handledProps
    validateNumeric(vSamples)
    const area = groupNode.select('area')
    if (area.get('height') === null) {
      area.set('height', vSamples)
    }
    else {
      ParametricSurface.rerender(groupNode, handledProps, handlers)
    }
  }

  // The next two handlers all perform validation, then delegate to updateExpr
  // Handlers are structured this way because range properties can be functions.
  static handleRange(nodes: HandlerNodes, handledProps: HandledProps) {
    const { rangeU, rangeV, expr } = handledProps
    const { dataNodes: area } = nodes

    const isRangeValid = ParametricSurface.isRangeValid(rangeU, rangeV)
    const isExprValid = hasFunctionSignature(expr, 2, 3)
    if (isRangeValid && isExprValid) {
      ParametricSurface.updateExpr(area, rangeU, rangeV, expr)
    }
    else if (!isRangeValid) {
      if (typeof rangeU === 'function' && typeof rangeV === 'function') {
        throw new Error('Either the u-range can depend on v, OR the v-range can dependent on u, but NOT both.')
      }
      else {
        throw new Error(`Parameter ranges must be 2-component arrays.`)
      }
    }

  }

  static isRangeValid(rangeU: mixed, rangeV: mixed) {
    if (isVector(rangeU, 2) && isVector(rangeV, 2)) {
      return true
    }
    else if (hasFunctionSignature(rangeU, 1, 2) && isVector(rangeV, 2)) {
      return true
    }

    else if (isVector(rangeU, 2) && hasFunctionSignature(rangeV, 1, 2)) {
      return true
    }
    else {
      return false
    }
  }

  static handleExpr(nodes: HandlerNodes, handledProps: HandledProps) {
    const { expr, rangeU, rangeV } = handledProps
    const { dataNodes: area } = nodes
    validateFunctionSignature(expr, 2, 3)
    const isRangeValid = ParametricSurface.isRangeValid(rangeU, rangeV)

    // Already know expr is valid
    if (isRangeValid) {
      ParametricSurface.updateExpr(area, rangeU, rangeV, expr)
    }
  }

  // assumes expr, rangeU, rangeV all valid
  static updateExpr(
    area: MathBoxNode,
    rangeU: [number, number] | (number) => [number, number],
    rangeV: [number, number] | (number) => [number, number],
    expr: (number, number) => [number, number, number]
  ) {
    // Cases
    if (Array.isArray(rangeU) && Array.isArray(rangeV)) {
      area.set('expr', (emit, u, v) => {
        const du = rangeU
        const dv = rangeV
        const trueU = du[0] + u*(du[1] - du[0] )
        const trueV = dv[0] + v*(dv[1] - dv[0] )
        return emit(...expr(trueU, trueV))
      } )
    }
    else if (Array.isArray(rangeU) && typeof rangeV === 'function') {
      area.set('expr', (emit, u, v) => {
        const du = rangeU
        const trueU = du[0] + u*(du[1] - du[0] )
        // $FlowFixMe
        const dv = rangeV(trueU)
        const trueV = dv[0] + v*(dv[1] - dv[0] )
        return emit(...expr(trueU, trueV))
      } )
    }
    else if (Array.isArray(rangeV) && typeof rangeU === 'function') {
      area.set('expr', (emit, u, v) => {
        const dv = rangeV
        const trueV = dv[0] + v*(dv[1] - dv[0] )
        // $FlowFixMe
        const du = rangeU(trueV)
        const trueU = du[0] + u*(du[1] - du[0] )
        return emit(...expr(trueU, trueV))
      } )
    }
    else {
      throw new Error(`Expected rangeV and rangeU to be (1) array, array (2)
                       array, function, or (3) function array. Instead, found
                       ${typeof rangeU} and ${typeof rangeV}`)
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

  static rerender(groupNode: MathBoxNode, handledProps: HandledProps, handlers: Handlers) {
    groupNode.select('area, surface, .gridU, .gridV').remove()
    ParametricSurface.renderParametricSurface(groupNode)
    const newNodes = {
      groupNode,
      dataNodes: groupNode.select('area'),
      renderNodes: groupNode.select('surface')
    }
    Object.keys(handlers).forEach(key => {
      handlers[key](newNodes, handledProps, handlers)
    } )
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
    rangeX: ImplicitSurface.makeHandleRange('rangeX'),
    rangeY: ImplicitSurface.makeHandleRange('rangeY'),
    rangeZ: ImplicitSurface.makeHandleRange('rangeZ'),
    samples: ImplicitSurface.handleSamples
  }

  // The next several handlers all validate, then delgate to updateData
  static handleLHS(nodes: HandlerNodes, handledProps: HandledProps) {
    const { lhs } = handledProps
    validateFunctionSignature(lhs, 3, 1)
    ImplicitSurface.updateData(nodes, handledProps)
  }

  static handleRHS(nodes: HandlerNodes, handledProps: HandledProps) {
    const { rhs } = handledProps
    validateFunctionSignature(rhs, 3, 1)
    ImplicitSurface.updateData(nodes, handledProps)
  }

  static makeHandleRange(rangeName: 'rangeX' | 'rangeY' | 'rangeZ') {
    return (nodes: HandlerNodes, handledProps: HandledProps) => {
      const range = handledProps[rangeName]
      validateVector(range, 2)
      ImplicitSurface.updateData(nodes, handledProps)
    }
  }

  static handleSamples(nodes: HandlerNodes, handledProps: HandledProps) {
    const { samples } = handledProps
    validateNumeric(samples)
    ImplicitSurface.updateData(nodes, handledProps)
  }

  static canUpdate(handledProps: HandledProps) {
    const { lhs, rhs, rangeX, rangeY, rangeZ, samples } = handledProps
    return (
      isVector(rangeX, 2) &&
      isVector(rangeY, 2) &&
      isVector(rangeZ, 2) &&
      hasFunctionSignature(lhs, 3, 1) &&
      hasFunctionSignature(rhs, 3, 1) &&
      isNumeric(samples)
    )
  }

  static updateData(nodes: HandlerNodes, handledProps: HandledProps) {
    if (!ImplicitSurface.canUpdate(handledProps)) {
      return
    }
    const { lhs, rhs, rangeX, rangeY, rangeZ, samples } = handledProps
    const { dataNodes } = nodes

    const implicitFunc = (x, y, z) => lhs(x, y, z) - rhs(x, y, z)
    const implicitTriangles = marchingCubes(
      rangeX[0], rangeX[1],
      rangeY[0], rangeY[1],
      rangeZ[0], rangeZ[1],
      implicitFunc, 0, samples)

    // "samples" really determines the field discretization length
    // true number of samples depends on discretization length and implicitFunc
    const trueSamplesNum = implicitTriangles.length
    // Sample cap of 5400 was found experimentally; I do not really understand
    // what goes wrong when too many samples are generated.
    if (trueSamplesNum > 5400) {
      throw new Error('Too many data points generated. Please decrease sample size.')
    }

    dataNodes.set( {
      data: implicitTriangles,
      width: trueSamplesNum
    } )
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

export class VectorField extends AbstractMBC implements MathBoxComponent {

  dataNodeNames = ['volume']
  renderNodeNames = ['vector']
  handlers = {
    ...universalHandlers,
    ...lineLikeHandlers,
    rangeX: VectorField.makeHandleRange('rangeX'),
    rangeY: VectorField.makeHandleRange('rangeY'),
    rangeZ: VectorField.makeHandleRange('rangeZ'),
    samples: VectorField.handleSamples,
    scale: VectorField.handleScale,
    expr: VectorField.handleExpr
  }

  // handleExpr and makeHandleRange both delegate to updateRangeAndExpression.
  // handlers are structured this way because updating the range properties of
  // a volume node seems not to have any effect. Area nodes suffer a similar
  // bug, see discussion at
  // https://groups.google.com/forum/?fromgroups#!topic/mathbox/zLX6WJjTDZk
  // for an alternative approach.
  static makeHandleRange(rangeName: 'rangeX' | 'rangeY' | 'rangeZ') {
    return (nodes: HandlerNodes, handledProps: HandledProps) => {
      validateVector(handledProps[rangeName], 2)
      VectorField.updateRangeAndExpr(nodes, handledProps)
    }
  }

  static handleExpr(nodes: HandlerNodes, handledProps: HandledProps) {
    const { expr } = handledProps
    validateFunctionSignature(expr, 3, 3)
    VectorField.updateRangeAndExpr(nodes, handledProps)
  }

  static handleScale(nodes: HandlerNodes, handledProps: HandledProps) {
    const { scale } = handledProps
    isNumeric(scale)
    VectorField.updateRangeAndExpr(nodes, handledProps)
  }

  static canUpdateRangeAndExpr(rangeX: mixed, rangeY: mixed, rangeZ: mixed, expr: mixed, samples: mixed, scale: mixed) {
    return (
      isVector(rangeX, 2) &&
      isVector(rangeY, 2) &&
      isVector(rangeZ, 2) &&
      isVector(samples, 3) &&
      isNumeric(scale) &&
      hasFunctionSignature(expr, 3, 3)
    )
  }

  static updateRangeAndExpr(nodes: HandlerNodes, handledProps: HandledProps) {
    const { rangeX, rangeY, rangeZ, expr, samples, scale } = handledProps
    const { dataNodes: volume } = nodes
    if (!VectorField.canUpdateRangeAndExpr(rangeX, rangeY, rangeZ, expr, samples, scale)) {
      return
    }

    volume.set('expr', (emit, scaledX, scaledY, scaledZ) => {
      const percentX = samples[0] === 1 ? 0.5 : scaledX
      const percentY = samples[1] === 1 ? 0.5 : scaledY
      const percentZ = samples[2] === 1 ? 0.5 : scaledZ

      const x = rangeX[0] + percentX * (rangeX[1] - rangeX[0] )
      const y = rangeY[0] + percentY * (rangeY[1] - rangeY[0] )
      const z = rangeZ[0] + percentZ * (rangeZ[1] - rangeZ[0] )
      emit(x, y, z)
      const [vx, vy, vz] = expr(x, y, z)
      emit(x + scale*vx, y + scale*vy, z + scale*vz)
    } )
  }

  mathboxRender = (parent) => {
    const group = parent.group( { classes: ['vector-field'] } )

    return VectorField.renderVectorField(group)
  }

  static renderVectorField(group: MathBoxNode) {
    group.volume( {
      items: 2,
      channels: 3,
      rangeX: [0, 1],
      rangeY: [0, 1],
      rangeZ: [0, 1]
    } ).vector()

    return group
  }

  static rerender(groupNode: MathBoxNode, handledProps: HandledProps, handlers: Handlers) {
    groupNode.select('volume, vector').remove()
    VectorField.renderVectorField(groupNode)
    const newNodes = {
      groupNode,
      dataNodes: groupNode.select('volume'),
      renderNodes: groupNode.select('vector')
    }
    Object.keys(handlers).forEach(key => {
      console.log(`rerrunning ${key}`)
      handlers[key](newNodes, handledProps, handlers)
    } )
  }

  static handleSamples(nodes: HandlerNodes, handledProps: HandledProps, handlers: Handlers) {
    const { dataNodes, groupNode } = nodes
    const { samples } = handledProps
    validateVector(samples, 3)
    const volume = dataNodes
    if (volume.get('width') === null) {
      dataNodes.set( {
        width: samples[0],
        height: samples[1],
        depth: samples[2]
      } )
    }
    else {
      VectorField.rerender(groupNode, handledProps, handlers)
    }
  }

}

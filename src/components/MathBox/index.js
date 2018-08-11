import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

// TODO: Reorganize this

export default class MathBox extends PureComponent {

  static propTypes = {
    mathbox: PropTypes.object.isRequired
  }

  mathboxNode = this.props.mathbox

  render() {
    if (!this.props.children) {
      return null
    }
    return React.Children.map(
      this.props.children,
      child => React.cloneElement(child, { mathboxParent: this.mathboxNode } )
    )
  }

}

// TODO: use shallow-diff instead ...
function diff(o1, o2) {
  return Object.keys(o1).reduce((theDiff, key) => {
    if (o1[key] === o2[key] ) return theDiff
    theDiff[key] = o1[key]
    return theDiff
  }, {} )
}

class MathBoxComponent extends React.Component {

  oldProps = {}
  diffProps = {}

  shouldComponentUpdate = (nextProps, nextState) => {
    this.oldProps = this.props
    this.diffProps = diff(nextProps, this.props)
    return Object.getOwnPropertyNames(this.diffProps).length !== 0
  }

  componentDidMount = () => {
    this.mathboxNode = this.mathboxRender(this.props.mathboxParent)
    this.forceUpdate()
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

}

export class Cartesian extends MathBoxComponent {

  mathboxRender = (parent) => {
    const node = parent.cartesian( {
      range: [[-5, 5], [-5, 5], [-5, 5]],
      scale: [2, 2, 1]
    } )
    return node
  }

  mathboxUpdate = () => {

  }

}

export class Grid extends MathBoxComponent {

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

  mathboxUpdate = () => {

  }

}

export class Point extends MathBoxComponent {

  mathboxRender = (parent) => {
    const node = parent.group()

    node.array( {
      data: [this.props.coords]
    } )
      .point( {
        size: this.props.size,
        color: this.props.color
      } )

    return node
  }

  mathboxUpdate = () => {
    const array = this.mathboxNode.select('array')
    const point = this.mathboxNode.select('point')
    array.set('data', [this.props.coords] )
    point.set('color', this.props.color)
  }

}

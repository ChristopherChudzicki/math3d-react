import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

// TODO: Reorganize this

export class MathBox extends PureComponent {

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
      child => React.cloneElement(child, {
        mathboxParent: this.mathboxNode,
        mathbox: this.mathboxNode
      } )
    )
  }

}

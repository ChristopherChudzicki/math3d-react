import React, { PureComponent } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'

const MathBoxOuterDiv = styled.div`
  width: 100%;
  transform: translateX(${props => props.leftOffset});
  transition-duration: 1s;
  & ${props => !props.isAnimating && css`
    transition-duration: 0s;
  `}
`

/**
 * This is a wrapper around the MathBox div with a few props to influence
 * positioning.
 *
 * @type {PureComponent}
 */

export default class MathBoxContainer extends PureComponent {

  static propTypes = {
    leftOffset: PropTypes.string.isRequired,
    mathboxElement: PropTypes.instanceOf(Element),
    children: PropTypes.oneOfType( [
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ] )
  }

  assignRef = ref => {
    this.ref = ref
  }

  componentDidMount() {
    const mathboxElement = this.props.mathboxElement
    mathboxElement.parentNode.removeChild(mathboxElement)
    this.ref.appendChild(mathboxElement)
  }

  render() {
    return (
      <MathBoxOuterDiv
        leftOffset={this.props.leftOffset}
        ref={this.assignRef}>
        {this.props.children}
      </MathBoxOuterDiv>
    )
  }

}

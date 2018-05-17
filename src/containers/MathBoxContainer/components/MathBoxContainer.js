import React, { PureComponent } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import MathBox from 'components/MathBox/MathBox'

const MathBoxOuterDiv = styled.div`
  width: 100%;
  transform: translateX(${props => props.leftOffset});
  transition-duration: ${props => props.theme.transitionDuration};
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
    children: validateChildren
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
        innerRef={this.assignRef}>
        {this.props.children}
      </MathBoxOuterDiv>
    )
  }

}

function validateChildren(props, propName, componentName) {
  const children = props[propName]
  if (React.Children.count(children) !== 1) {
    return Error(`${componentName} must have ${MathBox.name} as its unique child.`)
  }
  if (children.type === MathBox) {
    return null
  }
  return Error(`${componentName} must have ${MathBox.name} as its child.`)
}

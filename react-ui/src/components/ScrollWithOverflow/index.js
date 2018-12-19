import React, { PureComponent } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

/**
 * ScrollWithOverflow is a component intended to allow scrolling in the
 * y-direction and overflow in the x-direction.
 *
 * Naively, this would just be achieved by setting
 *    overflow-x: visible;
 *    overflow-y: scroll;
 * on whatever div you want. But that doesn't work:
 *    https://stackoverflow.com/questions/6421966/css-overflow-x-visible-and-overflow-y-hidden-causing-scrollbar-issue
 * This component solves the problem by adding positive padding and
 * negative margin:
 *  padding-right: 100vw;
 *  margin-right: -100vw;
 * so that children can appear to overflow without actually overflowing.
 *
 * This approach has a few downsides:
 *  1. Other elements in the padding region do not receive pointer events.
 *    - solved by conditional application of pointer-events:none
 *  2. The scrollbar disappears (pushed by padding)
 *    - TODO: Solve this, or at least alleviate with other styling (like
 *      top/bottom shadows) to indicate scrolling
 * Not ideal, but the best I've got for now...
 */

const ScrollingDiv = styled.div`
  overflow-y: scroll;
  padding-right: 100vw;
  margin-right: -100vw;
  height: 100%;
  border: 1pt solid green;
  pointer-events: ${props => props.disablePointer ? 'none' : 'auto'};
  border-color: ${props => props.disablePointer ? 'red' : 'blue'}
`

const ScrollingDivInner = styled.div`
  overflow-x:visible;
  pointer-events:auto;
  height:100%;
  border: 1pt solid black;
`

export default class ScrollWithOverflow extends PureComponent {

  static propTypes = {
    children: PropTypes.oneOfType( [
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ] )
  }

  state = {
    isHovering: false
  }

  onPointerEnter = () => {
    console.log('enter')
    this.setState( { isHovering: true } )
  }
  onPointerLeave = () => {
    console.log('leave')
    this.setState( { isHovering: false } )
  }

  render() {
    return (
      <ScrollingDiv
        disablePointer={!this.state.isHovering}
      >
        <ScrollingDivInner
          onPointerEnter={this.onPointerEnter}
          onPointerLeave={this.onPointerLeave}
        >
          {this.props.children}
        </ScrollingDivInner>
      </ScrollingDiv>
    )
  }

}

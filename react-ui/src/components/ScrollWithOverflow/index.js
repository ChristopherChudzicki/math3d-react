// @flow
import * as React from 'react'
import styled from 'styled-components'

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
 *    - solved by z-index settings on Scene/SceneBoundary
 *    - also required child popovers to use root as parent
 *  2. The scrollbar disappears (pushed by padding)
 *    - TODO: Solve this, or at least alleviate with other styling (like
 *      top/bottom shadows) to indicate scrolling
 * Not ideal, but the best I've got for now...
 */

const ScrollingDiv = styled.div`
  display:flex;
  overflow-y: ${props => props.isScrollEnabled ? 'scroll' : 'hidden'};
  padding-right: 100vw;
  margin-right: -100vw;
  height: 100%;
`

const ScrollingDivInner = styled.div`
  overflow-x:visible;
  height:100%;
  pointer-events: auto;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 1;
  width:100%;
`

const PaddingCover = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 0;
  max-width:0px;
  padding-right: 100vw;
  margin-right: -100vw;
  position:relative;
`

function forwardEventToElement(domElement: HTMLElement, event: SyntheticEvent<HTMLElement>) {
  event.stopPropagation()
  let syntheticEvent
  if (event.nativeEvent instanceof MouseEvent) {
    // $FlowFixMe
    syntheticEvent = new MouseEvent(event.type, event.nativeEvent)
  }
  else if (event.nativeEvent instanceof TouchEvent) {
    syntheticEvent = new TouchEvent(event.type, event.nativeEvent)
  }
  else {
    console.log(event)
    throw new TypeError(`Event not recognized`)
  }
  domElement.dispatchEvent(syntheticEvent)
}

type Props = {
  children?: React.Node,
  forwardingElement: HTMLElement
}

type State = {
  isScrollEnabled: boolean
}

export default class ScrollWithOverflow extends React.PureComponent<Props, State> {

  state = {
    isScrollEnabled: true
  }

  canvas = window.mathbox.three.controls.domElement

  handleEvent = (event: SyntheticEvent<HTMLElement>) => {
    forwardEventToElement(this.canvas, event)
  }

  onTouchStart = (event: SyntheticEvent<HTMLElement>) => {
    this.setState( { isScrollEnabled: false } )
    forwardEventToElement(this.canvas, event)
  }
  onTouchEnd = (event: SyntheticEvent<HTMLElement>) => {
    this.setState( { isScrollEnabled: true } )
    forwardEventToElement(this.canvas, event)
  }

  render() {
    return (
      <ScrollingDiv isScrollEnabled={this.state.isScrollEnabled}>
        <ScrollingDivInner>
          {this.props.children}
        </ScrollingDivInner>
        <PaddingCover
          onMouseDown={this.handleEvent}
          onMouseMove={this.handleEvent}
          onMouseUp={this.handleEvent}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.handleEvent}
          onTouchEnd={this.onTouchEnd}
        />
      </ScrollingDiv>
    )
  }

}

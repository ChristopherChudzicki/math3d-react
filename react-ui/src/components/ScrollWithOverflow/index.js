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
 *  1. Other elements covered by the padding region do not emit pointer events.
 *  2. The scrollbar disappears (pushed by padding)
 *
 * To resolve #1, we use event handlers to forward events to the covered up
 * mathbox canvas element. Note: this works for because only 1 element is
 * covered. If multiple elements were covered, we'd have trouble
 *
 * I currently have not good solution for #2.
 *
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

  // Wheel events can be either any of (mousewheel, DOMMouseScroll, wheel). But
  // The MathBox version of OrbitControls only listens to the first two.
  const type = event.type === 'wheel' ? 'mousewheel' : event.type

  // $FlowFixMe
  const syntheticEvent = new event.nativeEvent.constructor(type, event.nativeEvent)
  domElement.dispatchEvent(syntheticEvent)
  return syntheticEvent
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
    return forwardEventToElement(this.canvas, event)
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
          onWheel={event => {
            console.log('forwarding:')
            console.log(event)
            const synth = this.handleEvent(event)
            console.log(synth)
          }}
          onMouseUp={this.handleEvent}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.handleEvent}
          onTouchEnd={this.onTouchEnd}
        />
      </ScrollingDiv>
    )
  }

}

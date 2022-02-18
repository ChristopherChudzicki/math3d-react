// @flow
import * as React from 'react'
import styled from 'styled-components'
import { mathbox } from "containers/MathBoxScene/components/MathBoxScene.js";

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
  overflow-y: scroll;
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
  /* The z-index means that elements overflowing from ScrollingDivInner into
  PaddingCover still trigger the current pointer events within their
  overflowing region */
  z-index:10;
`

/**
 * This is absolutely positioned so that when the left control panel scrolls,
 * the padding cover stays in place.
 * Ruins the generality of this component, but works fine for our use case =/
 *
 * + 400px is for the sidebar width, so padding cover covers the whole screen
 * when sidebar is slide left.
 *
 */
const PaddingCover = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 0;
  max-width:0px;
  padding-right: calc(100vw + 400px);
  margin-right: -100vw;
  position: absolute;
  bottom:0;
  top: 65px;
`

function forwardEventToElement(domElement: HTMLElement, event: Event) {
  event.stopPropagation()
  event.preventDefault()
  // $FlowFixMe
  const syntheticEvent = new event.constructor(event.type, event)
  domElement.dispatchEvent(syntheticEvent)
}

type Props = {
  children?: React.Node
}

type State = {
  isScrollEnabled: boolean
}

export default class ScrollWithOverflow extends React.PureComponent<Props, State> {

  coverRef: { current: null | HTMLDivElement }

  eventNames = [
    'pointerdown', 'pointermove', 'pointerup',
    'pointercancel', 'wheel', 'mousewheel'
  ]

  domElement = mathbox.three.controls.domElement

  constructor(props: Props) {
    super(props)
    this.coverRef = React.createRef()
  }

  forwardEvent = (event: Event) => {
    forwardEventToElement(this.domElement, event)
  }

  componentDidMount() {
    const { current } = this.coverRef
    if (current === null) { return }
    const options = { passive: false }
    this.eventNames.forEach(eventName => {
      current.addEventListener(eventName, this.forwardEvent, options)
    } )
  }

  componentWillUnmount() {
    const { current } = this.coverRef
    if (current === null) { return }
    this.eventNames.forEach(eventName => {
      current.removeEventListener(eventName, this.forwardEvent)
    } )
  }

  render() {
    return (
      <ScrollingDiv>
        <ScrollingDivInner>
          {this.props.children}
        </ScrollingDivInner>
        <PaddingCover ref={this.coverRef} />
      </ScrollingDiv>
    )
  }

}

import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

/**
 * PartlyDraggable
 *
 * Temporarily sets isDragDisabled=true when PointerDown event encounters
 * an HTML element that custom isElementDraggable detects as undraggable.
 * isElementDraggable could be customized for other use-cases.
 */
export default class PartlyDraggable extends React.PureComponent {

  state = {
    targetUndraggable: false
  }

  constructor(props) {
    super(props)
    this.rootRef = React.createRef()
    this.onPointerDown = this.onPointerDown.bind(this)
    this.onPointerUp = this.onPointerUp.bind(this)
  }

  static isElementDraggable(element) {
    // Detects MathQuill editable fields
    if (element.classList.contains('mq-editable-field')) {
      return false
    }
    // Detects Ant Design Slider elements
    if (element.classList.contains('ant-slider')) {
      return false
    }
    return true
  }

  static isDragAllowed(top, current) {
    if (top === current) {
      return true
    }
    if (!PartlyDraggable.isElementDraggable(current)) {
      return false
    }
    return PartlyDraggable.isDragAllowed(top, current.parentElement)
  }

  onPointerDown = (event) => {
    const { target } = event
    const rootEle = this.rootRef.current
    if (!PartlyDraggable.isDragAllowed(rootEle, target)) {
      this.setState( { targetUndraggable: true } )
    }
  }

  onPointerUp = () => {
    this.setState( { targetUndraggable: false } )
  }

  render() {
    const { id, isDragDisabled, children, ...otherProps } = this.props
    const { targetUndraggable } = this.state
    return (
      <div
        onPointerDown={this.onPointerDown}
        onPointerUp={this.onPointerUp}
        ref={this.rootRef}
      >
        <Draggable
          key={id}
          isDragDisabled={targetUndraggable || isDragDisabled}
          {...otherProps}
        >
          {this.props.children}
        </Draggable>
      </div>
    )
  }

}

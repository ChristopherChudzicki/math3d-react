import React from 'react'
import PropType from 'prop-types'
import Pointable from 'react-pointable'

function eventToPosition(event) {
  return {
    x: event.clientX,
    y: event.clientY
  }
}

function distance(pointA, pointB) {
  return Math.sqrt(
    Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
  )
}

export default class LongPressable extends React.PureComponent {

  static propTypes = {
    onLongPress: PropType.func.isRequired,
    onShortPress: PropType.func,
    longPressTime: PropType.number,
    primaryMouseButtonOnly: PropType.bool,
    // Maximum distance (pixels) user is allowed to drag before
    // click is canceled
    dragThreshold: PropType.number,
    children: PropType.node
  }

  static defaultProps = {
    longPressTime: 500,
    primaryMouseButtonOnly: true,
    dragThreshold: 100
  }

  isLongPressing = false
  startingPosition = { x: 0, y: 0 }

  onPointerUp = (e) => {
    if (this.timerID) {
      this.clearLongPressTimer()
    }

    const mousePosition = eventToPosition(e)

    if (!this.isLongPressing &&
        !this.exceedDragThreshold(mousePosition)) {
      this.props.onShortPress()
    }
    else {
      this.isLongPressing = false
    }
  }

  onPointerDown = (e) => {
    if (this.props.primaryMouseButtonOnly) {
      if (e.pointerType === 'mouse' && e.button !== 0) {
        return
      }
    }

    this.startingPosition = eventToPosition(e)

    this.timerID = setTimeout(() => {
      this.isLongPressing = true
      this.props.onLongPress()
    }, this.props.longPressTime)
  }

  onPointerMove = (e) => {
    const mousePosition = eventToPosition(e)
    if (this.timerID && this.exceedDragThreshold(mousePosition)) {
      this.clearLongPressTimer()
    }
  }

  onPointerLeave = () => {
    if (this.timerID) {
      this.clearLongPressTimer()
    }
  }

  clearLongPressTimer() {
    clearTimeout(this.timerID)
    this.timerID = null
  }

  exceedDragThreshold(point) {
    return distance(this.startingPosition, point) > this.props.dragThreshold
  }

  render() {
    return (
      <Pointable
        onPointerUp={this.onPointerUp}
        onPointerDown={this.onPointerDown}
        onPointerMove={this.onPointerMove}
        onPointerLeave={this.onPointerLeave}
      >
        {this.props.children}
      </Pointable>
    )
  }

}

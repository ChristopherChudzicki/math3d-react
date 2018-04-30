import React from 'react'
import PropType from 'prop-types'
import Pointable from 'react-pointable'

export default class LongPressable extends React.PureComponent {

  static propTypes = {
    onLongPress: PropType.func.isRequired,
    onShortPress: PropType.func,
    longPressTime: PropType.number,
    primaryMouseButtonOnly: PropType.bool,
    dragThreshold: PropType.number,
    children: PropType.node
  }

  static defaultProps = {
    longPressTime: 500,
    primaryMouseButtonOnly: true,
    dragThreshold: 0
  }

  isLongPressing = false
  dragCounter = 0

  onPointerUp = () => {
    if (this.timerID) {
      this.clearLongPressTimer()
    }

    if (!this.isLongPressing) {
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

    this.dragCounter = 0

    this.timerID = setTimeout(() => {
      this.isLongPressing = true
      this.props.onLongPress()
    }, this.props.longPressTime)
  }

  onPointerMove = () => {
    this.dragCounter++

    if (this.timerID && this.dragCounter > this.props.dragThreshold) {
      this.clearLongPressTimer()
    }
  }

  clearLongPressTimer() {
    clearTimeout(this.timerID)
    this.timerID = null
  }

  render() {
    return (
      <Pointable
        onPointerUp={this.onPointerUp}
        onPointerDown={this.onPointerDown}
        onPointerMove={this.onPointerMove}
      >
        {this.props.children}
      </Pointable>
    )
  }

}

import React from 'react'
import PropType from 'prop-types'
import Pointable from 'react-pointable'

export default class LongPressable extends React.PureComponent {

  static propTypes = {
    onLongPress: PropType.func.isRequired,
    onShortPress: PropType.func,
    longPressTime: PropType.number,
    primaryMouseButtonOnly: PropType.bool,
    children: PropType.node
  }

  static defaultProps = {
    longPressTime: 500,
    primaryMouseButtonOnly: true
  }

  isLongPressing = false

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

    this.timerID = setTimeout(() => {
      this.isLongPressing = true
      this.props.onLongPress()
    }, this.props.longPressTime)
  }

  onPointerMove = () => {
    if (this.timerID) {
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

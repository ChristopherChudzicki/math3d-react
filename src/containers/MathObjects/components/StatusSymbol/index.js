import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import LongPressable from 'components/LongPressable'
import ColorPickerPopover from './components/ColorPickerPopover'

const Circle = styled.div`
  width: 28px;
  height: 28px;
  border-radius:28px;
  border: 1px solid ${props => props.color};
  background-color: ${props => props.isFilled ? props.color : 'white'};
  cursor: pointer;
`

export default class StatusSymbol extends React.PureComponent {

  state = {
    displayColorPicker: false
  }

  static propTypes = {
    isFilled: PropTypes.bool.isRequired,
    onToggleVisibility: PropTypes.func.isRequired,
    color: PropTypes.string.isRequired,
    onPickColor: PropTypes.func.isRequired
  }

  showColorPicker = () => {
    this.setState( { displayColorPicker: true } )
  }

  hideColorPicker = () => {
    this.setState( { displayColorPicker: false } )
  }

  render() {
    return (
      <ColorPickerPopover
        color={this.props.color}
        visible={this.state.displayColorPicker}
        onPickColor={this.props.onPickColor}
        onHideColorPicker={this.hideColorPicker}
      >
        <LongPressable
          onLongPress={this.showColorPicker}
          onShortPress={this.props.onToggleVisibility}
        >
          <Circle
            isFilled={this.props.isFilled}
            color={this.props.color}
          />
        </LongPressable>
      </ColorPickerPopover>
    )
  }

}

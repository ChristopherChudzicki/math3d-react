// @flow
import * as React from 'react'
import styled from 'styled-components'
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

type Props = {
  isFilled: boolean,
  onToggleVisibility: () => void,
  color: string,
  onPickColor: (color: string) => void,
  colors?: Array<string>,
  extraTabs?: React.Node
}

type State = {
  displayColorPicker: boolean
}

export default class StatusSymbol extends React.PureComponent<Props, State> {

  state = {
    displayColorPicker: false
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
        extraTabs={this.props.extraTabs}
        colors={this.props.colors}
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

// @flow
import * as React from 'react'
import styled from 'styled-components'
import LongPressable from 'components/LongPressable'
import ColorPickerPopover from './components/ColorPickerPopover'
import { colorMaps } from 'constants/colors'

const Circle = styled.div`
  width: 28px;
  height: 28px;
  border-radius:28px;
  border: 1px solid ${props => props.color};
  background-color: ${props => props.isFilled ? props.color : 'white'};
  cursor: pointer;
  ${props => props.gradient};
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
    const { color } = this.props
    const gradient = colorMaps[color] && colorMaps[color].css

    return (
      <ColorPickerPopover
        extraTabs={this.props.extraTabs}
        colors={this.props.colors}
        color={color}
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
            color={color}
            gradient={gradient}
          />
        </LongPressable>
      </ColorPickerPopover>
    )
  }

}

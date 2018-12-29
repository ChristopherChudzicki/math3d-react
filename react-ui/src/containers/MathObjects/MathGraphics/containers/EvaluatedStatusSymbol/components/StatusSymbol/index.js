// @flow
import * as React from 'react'
import styled from 'styled-components'
import LongPressable from 'components/LongPressable'
import ColorPickerPopover from './components/ColorPickerPopover'
import { colorMaps } from 'constants/colors'

const Circle = styled.div`
  width: 30px;
  height: 30px;
  border-radius:30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items:center;
  cursor: pointer;
  background-color: ${props => props.color};
  ${props => props.gradient};
`
const InnerCircle = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 26px;
  background-color: ${props => props.isFilled ? 'rgba(0, 0, 0, 0)' : 'white'};
  display: flex;
  justify-content: center;
  align-items:center;
  pointer-events:none;
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
            color={color}
            gradient={gradient}
          >
            <InnerCircle isFilled={this.props.isFilled}/>
          </Circle>
        </LongPressable>
      </ColorPickerPopover>
    )
  }

}

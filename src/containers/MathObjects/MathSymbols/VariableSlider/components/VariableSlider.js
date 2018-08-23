import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MathObjectUI from 'containers/MathObjects/MathObjectUI'
import {
  MainRow
} from 'containers/MathObjects/components'
import { VARIABLE_SLIDER } from 'containers/MathObjects/mathObjectTypes'
import SliderValueDisplay from './SliderValueDisplay'
import SliderWithLimits from './SliderWithLimits'
import AnimationControls from './AnimationControls'

export default class VariableSlider extends PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    isAnimating: PropTypes.bool.isRequired,
    fps: PropTypes.number.isRequired,
    baseAnimationDuration: PropTypes.number.isRequired,
    animationMultiplier: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    valueText: PropTypes.string, // latex
    setSliderValue: PropTypes.func.isRequired
  }

  static defaultProps = {
    isAnimating: false,
    fps: 30,
    baseAnimationDuration: 4,
    animationMultiplier: 1
  }

  constructor(props) {
    super(props)
    this.onSliderChange = this.onSliderChange.bind(this)
  }

  onSliderChange(value) {
    const type = VARIABLE_SLIDER
    const { id, valueText } = this.props
    this.props.setSliderValue(id, type, valueText, value)
  }

  render() {
    const {
      id,
      value,
      valueText
    } = this.props
    return (
      <MathObjectUI
        id={id}
        type={VARIABLE_SLIDER}
      >
        <MainRow>
          <SliderValueDisplay
            parentId={id}
            valueText={valueText === null ? `${value}` : valueText}
          />
          <AnimationControls />
        </MainRow>
        <MainRow>
          <SliderWithLimits
            parentId={id}
            value={this.props.value}
            minValue={-10}
            maxValue={10}
            onSliderChange={this.onSliderChange}
          />
        </MainRow>
      </MathObjectUI>
    )
  }

}

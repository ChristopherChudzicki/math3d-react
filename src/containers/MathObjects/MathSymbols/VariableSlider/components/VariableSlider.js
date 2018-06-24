import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'
import {
  MainRow
} from 'containers/MathObjects/components'
import {
  isNumeric,
  isAssignmentLHS,
  isValidName
} from 'containers/MathObjects/components/MathInput'
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
    min: PropTypes.string.isRequired, // latex
    max: PropTypes.string.isRequired, // latex
    name: PropTypes.string.isRequired, // latex
    setValidatedProperty: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    setSliderValue: PropTypes.func.isRequired,
    errors: PropTypes.objectOf(PropTypes.string).isRequired,
    validateNameAgainst: PropTypes.any
  }

  static defaultProps = {
    isAnimating: false,
    fps: 30,
    baseAnimationDuration: 4,
    animationMultiplier: 1
  }

  static nameValidators = [
    isAssignmentLHS,
    isValidName
  ]

  static valueValidators = [
    isNumeric
  ]

  constructor(props) {
    super(props)
    this.onSliderChange = this.onSliderChange.bind(this)
  }

  onSliderChange(value) {
    this.props.setSliderValue(value, this.props.valueText)
  }

  render() {
    const {
      value,
      valueText
    } = this.props
    return (
      <MathObject
        id={this.props.id}
        type={VARIABLE_SLIDER}
      >
        <MainRow>
          <SliderValueDisplay
            name={this.props.name}
            nameValidators={VariableSlider.nameValidators}
            validateNameAgainst={this.props.validateNameAgainst}
            valueText={valueText === null ? `${value}` : valueText}
            onValidatedTextChange={this.props.setValidatedProperty}
            errors={this.props.errors}
            onValidatorAndErrorChange={this.props.setError}
          />
          <AnimationControls />
        </MainRow>
        <MainRow>
          <SliderWithLimits
            value={this.props.value}
            minText={this.props.min}
            maxText={this.props.max}
            onValidatedTextChange={this.props.setValidatedProperty}
            minValue={-10}
            maxValue={10}
            errors={this.props.errors}
            onValidatorAndErrorChange={this.props.setError}
            onSliderChange={this.onSliderChange}
          />
        </MainRow>
      </MathObject>
    )
  }

}

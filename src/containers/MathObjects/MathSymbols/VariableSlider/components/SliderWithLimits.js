import React, { PureComponent, Fragment } from 'react'
import { Slider } from 'antd'
import PropTypes from 'prop-types'
import {
  MathInput
} from 'containers/MathObjects/components'

SliderWithLimits.propTypes = {
  value: PropTypes.number.isRequired,
  minText: PropTypes.string.isRequired,
  maxText: PropTypes.string.isRequired,
  onValidatedTextChange: PropTypes.func.isRequired,
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  errors: PropTypes.object.isRequired,
  onValidatorChange: PropTypes.func.isRequired,
  onSliderChange: PropTypes.func.isRequired
}

export default function SliderWithLimits(props) {
  return (
    <Fragment>
      <MathInput
        field='min'
        style={{ flex: 0 }}
        latex={props.minText}
        onValidatedTextChange={props.onValidatedTextChange}
        onValidatorChange={props.onValidatorChange}
        errorMsg={props.errors.min}
      />
      <div style={ { flex: 1 } }>
        <Slider
          min={props.minValue}
          max={props.maxValue}
          tipFormatter={null}
          value={props.value}
          step={0.01}
          onChange={props.onSliderChange}
        />
      </div>
      <MathInput
        field='max'
        style={{ flex: 0 }}
        latex={props.maxText}
        onValidatedTextChange={props.onValidatedTextChange}
        onValidatorChange={props.onValidatorChange}
        errorMsg={props.errors.max}
      />
    </Fragment>
  )
}

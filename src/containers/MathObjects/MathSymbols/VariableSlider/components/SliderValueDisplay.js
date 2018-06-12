import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  MathInput,
  StaticMathLarge
} from 'containers/MathObjects/components'

SliderValueDisplay.propTypes = {
  name: PropTypes.string.isRequired,
  nameValidators: PropTypes.arrayOf(PropTypes.func).isRequired,
  validateNameAgainst: PropTypes.any,
  valueText: PropTypes.string.isRequired,
  onTextChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  onErrorChange: PropTypes.func.isRequired
}

export default function SliderValueDisplay(props) {
  return (
    <Fragment>
      <MathInput
        style={{ flex: 0 }}
        field={'name'}
        latex={props.name}
        onTextChange={props.onTextChange}
        errorMsg={props.errors.name}
        onErrorChange={props.onErrorChange}
        validators={props.nameValidators}
        validateAgainst={props.validateNameAgainst}
      />
      <StaticMathLarge
        latex='='
      />
      <MathInput
        style={{ flex: 0 }}
        field={'value'}
        latex={props.valueText}
        onTextChange={props.onTextChange}
        errorMsg={props.errors.value}
        onErrorChange={props.onErrorChange}
      />
    </Fragment>
  )
}

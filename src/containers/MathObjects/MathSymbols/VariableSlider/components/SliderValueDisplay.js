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
  onValidatedTextChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  onValidatorChange: PropTypes.func.isRequired
}

export default function SliderValueDisplay(props) {
  return (
    <Fragment>
      <MathInput
        style={{ flex: 0 }}
        field={'name'}
        latex={props.name}
        onValidatedTextChange={props.onValidatedTextChange}
        errorMsg={props.errors.name}
        onValidatorChange={props.onValidatorChange}
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
        onValidatedTextChange={props.onValidatedTextChange}
        errorMsg={props.errors.value}
        onValidatorChange={props.onValidatorChange}
      />
    </Fragment>
  )
}

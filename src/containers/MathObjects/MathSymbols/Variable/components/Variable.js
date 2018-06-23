import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'
import {
  MathInput,
  StaticMathLarge,
  MainRow
} from 'containers/MathObjects/components'
import { VARIABLE } from 'containers/MathObjects/mathObjectTypes'
import {
  isAssignmentLHS,
  isValidName,
  isAssignment
} from 'containers/MathObjects/components/MathInput'

export default class Variable extends PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired, // latex
    name: PropTypes.string.isRequired, // latex
    setValidatedProperty: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    errors: PropTypes.objectOf(PropTypes.string).isRequired,
    validateNameAgainst: PropTypes.any
  }

  static nameValidators = [
    isAssignmentLHS,
    isValidName,
    isAssignment
  ]

  render() {
    return (
      <MathObject
        id={this.props.id}
        type={VARIABLE}
      >
        <MainRow>
          <MathInput
            style={{ flex: 0 }}
            field={'name'}
            latex={this.props.name}
            onTextChange={this.props.setValidatedProperty}
            errorMsg={this.props.errors.name}
            onErrorChange={this.props.setError}
            validators={Variable.nameValidators}
            validateAgainst={this.props.validateNameAgainst}
          />
          <StaticMathLarge
            latex='='
          />
          <MathInput
            field='value'
            latex={this.props.value}
            onTextChange={this.props.setValidatedProperty}
            onErrorChange={this.props.setError}
            errorMsg={this.props.errors.value}
          />
        </MainRow>
      </MathObject>
    )
  }

}

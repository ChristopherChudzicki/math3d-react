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
    setPropertyAndError: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    errors: PropTypes.objectOf(PropTypes.string).isRequired,
    validateNameAgainst: PropTypes.any
  }

  static nameValidators = [
    isAssignmentLHS,
    isValidName,
    isAssignment
  ]

  static nameStyle = { flex: 0 }

  constructor(props) {
    super(props)
    const { id } = this.props
    const type = VARIABLE
    this.setPropertyAndError = this.props.setPropertyAndError.bind(this, id, type)
    this.setError = this.props.setError.bind(this, id)
  }

  render() {
    return (
      <MathObject
        id={this.props.id}
        type={VARIABLE}
      >
        <MainRow>
          <MathInput
            style={Variable.nameStyle}
            field={'name'}
            latex={this.props.name}
            onValidatedTextChange={this.setPropertyAndError}
            errorMsg={this.props.errors.name}
            onValidatorAndErrorChange={this.setError}
            validators={Variable.nameValidators}
            validateAgainst={this.props.validateNameAgainst}
          />
          <StaticMathLarge
            latex='='
          />
          <MathInput
            field='value'
            latex={this.props.value}
            onValidatedTextChange={this.setPropertyAndError}
            onValidatorAndErrorChange={this.setError}
            errorMsg={this.props.errors.value}
          />
        </MainRow>
      </MathObject>
    )
  }

}

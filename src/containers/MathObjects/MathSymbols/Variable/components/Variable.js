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
  isValidName
} from 'containers/MathObjects/components/MathInput'

export default class Variable extends PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired, // latex
    name: PropTypes.string.isRequired, // latex
    onEditProperty: PropTypes.func.isRequired,
    onErrorChange: PropTypes.func.isRequired,
    errors: PropTypes.objectOf(PropTypes.string).isRequired,
    validateNameAgainst: PropTypes.any
  }

  static nameValidators = [
    isAssignmentLHS,
    isValidName
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
            onTextChange={this.props.onEditProperty}
            errorMsg={this.props.errors.name}
            onErrorChange={this.props.onErrorChange}
            validators={Variable.nameValidators}
            validateAgainst={this.props.validateNameAgainst}
          />
          <StaticMathLarge
            latex='='
          />
          <MathInput
            field='value'
            latex={this.props.value}
            onTextChange={this.props.onEditProperty}
            onErrorChange={this.props.onErrorChange}
            errorMsg={this.props.errors.value}
          />
        </MainRow>
      </MathObject>
    )
  }

}

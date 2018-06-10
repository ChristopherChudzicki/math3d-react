import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'
import {
  MathInput,
  StaticMathLarge,
  MainRow
} from 'containers/MathObjects/components'
import { VARIABLE } from 'containers/MathObjects/mathObjectTypes'

export default class Variable extends PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired, // latex
    name: PropTypes.string.isRequired, // latex
    onEditValue: PropTypes.func.isRequired,
    onEditName: PropTypes.func.isRequired,
    onErrorChange: PropTypes.func.isRequired,
    errors: PropTypes.objectOf(PropTypes.string).isRequired,
    nameValidators: PropTypes.arrayOf(PropTypes.func).isRequired
  }

  render() {
    return (
      <MathObject
        id={this.props.id}
        type={VARIABLE}
      >
        <MainRow
          innerRef={this.getRef}
        >
          <MathInput
            style={{ flex: 0 }}
            field={'name'}
            latex={this.props.name}
            onTextChange={this.props.onEditName}
            errorMsg={this.props.errors.name}
            onErrorChange={this.props.onErrorChange}
            validators={this.props.nameValidators}
          />
          <StaticMathLarge
            latex='='
          />
          <MathInput
            field='value'
            latex={this.props.value}
            onTextChange={this.props.onEditValue}
            onErrorChange={this.props.onErrorChange}
            errorMsg={this.props.errors.value}
          />
        </MainRow>
      </MathObject>
    )
  }

}

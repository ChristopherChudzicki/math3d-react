import React, { PureComponent } from 'react'
import MathInput from './components/MathInput'
import { connect } from 'react-redux'
import { setPropertyAndError } from 'containers/MathObjects/actions'
import { parser } from 'constants/parsing'
import {
  isAssignmentLHS,
  isAssignment,
  isValidName
} from './components/validators'
import { setError } from 'services/errors'
import { getErrors } from 'services/errors/selectors'
import { getValidateNameAgainst, getMathObjectProp } from './selectors'
import PropTypes from 'prop-types'

/**
 * @module MathInputLHS defines a connected version of MathInput for left-hand-
 * side expressions.
 */

class MathInputLHS extends PureComponent {

  static propTypes = {
    // id of parent MathObject
    'parentId': PropTypes.string.isRequired,
    'type': PropTypes.string.isRequired,
    'onValidatedTextChange': PropTypes.func.isRequired,
    'onValidatorAndErrorChange': PropTypes.func.isRequired
  }

  static style = { flex: 0 }

  static validators = [
    isAssignmentLHS,
    isValidName,
    isAssignment
  ]

  constructor(props) {
    super(props)
    this.onValidatedTextChange = this.onValidatedTextChange.bind(this)
    this.onValidatorAndErrorChange = this.onValidatorAndErrorChange.bind(this)
  }

  onValidatedTextChange(prop, latex, error) {
    const { parentId, type } = this.props
    this.props.onValidatedTextChange(parentId, type, prop, latex, error)
  }

  onValidatorAndErrorChange(prop, error) {
    const { parentId, type } = this.props
    this.props.onValidatorAndErrorChange(parentId, type, prop, error)
  }

  render() {

    const {
      onValidatorAndErrorChange,
      onValidatedTextChange,
      parentId,
      type,
      ...otherProps
    } = this.props

    return (
      <MathInput
        {...otherProps}
        field='name'
        style={MathInputLHS.style}
        validators={MathInputLHS.validators}
        onValidatedTextChange={this.onValidatedTextChange}
        onValidatorAndErrorChange={this.onValidatorAndErrorChange}
      />
    )
  }

}

const mapStateToProps = ( { mathSymbols, parseErrors, evalErrors }, ownProps) => {
  const { parentId } = ownProps
  const errors = getErrors(parentId, parseErrors, evalErrors)
  return {
    type: getMathObjectProp( [mathSymbols], parentId, 'type'),
    latex: ownProps.latex
      ? ownProps.latex
      : mathSymbols[parentId].name,
    errorMsg: errors.name,
    validateAgainst: getValidateNameAgainst(parser, mathSymbols, parentId)
  }
}

const mapDispatchToProps = {
  onValidatedTextChange: setPropertyAndError,
  onValidatorAndErrorChange: setError
}

export default connect(mapStateToProps, mapDispatchToProps)(MathInputLHS)

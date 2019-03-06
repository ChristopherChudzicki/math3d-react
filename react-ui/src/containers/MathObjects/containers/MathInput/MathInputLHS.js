// @flow
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
import type { ErrorData } from 'services/errors'
import { getErrorMsg } from 'services/errors/selectors'
import { getValidateNameAgainst, getMathObjectProp } from './selectors'

/**
 * @module MathInputLHS defines a connected version of MathInput for left-hand-
 * side expressions.
 */

export type OwnProps = {|
  parentId: string,
  field: string,
  latex?: string,
  prefix?: string,
  postProcessLaTeX: (string) => string
|}
export type StateProps = {|
  type: string,
  validateAgainst: {|
    usedNames: Set<string>,
    latexRHS: string
  |},
  errorMsg?: string
|}
export type DispatchProps = {|
  onValidatedTextChange: typeof setPropertyAndError,
  onValidatorAndErrorChange: typeof setError
|}

export type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|}

class MathInputLHS extends PureComponent<Props> {

  static style = { flex: 0 }

  static validators = [
    isAssignmentLHS,
    isValidName,
    isAssignment
  ]

  static defaultProps = {
    postProcessLaTeX: (latex: string) => latex
  }

  constructor(props: Props) {
    super(props)
    // $FlowFixMe
    this.onValidatedTextChange = this.onValidatedTextChange.bind(this)
    // $FlowFixMe
    this.onValidatorAndErrorChange = this.onValidatorAndErrorChange.bind(this)
  }

  onValidatedTextChange(prop: string, latex: string, error: ErrorData) {
    const { parentId, type, postProcessLaTeX } = this.props
    const processedLaTeX = postProcessLaTeX(latex)
    this.props.onValidatedTextChange(parentId, type, prop, processedLaTeX, error)
  }

  onValidatorAndErrorChange(prop: string, error: ErrorData) {
    const { parentId } = this.props
    this.props.onValidatorAndErrorChange(parentId, prop, error)
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

const mapStateToProps = ( { mathSymbols, parseErrors, evalErrors, renderErrors }, ownProps) => {
  const { parentId } = ownProps
  return {
    type: getMathObjectProp( [mathSymbols], parentId, 'type'),
    latex: ownProps.latex
      ? ownProps.latex
      : mathSymbols[parentId].name,
    errorMsg: getErrorMsg(parentId, 'name', parseErrors, evalErrors, renderErrors),
    validateAgainst: getValidateNameAgainst(parser, mathSymbols, parentId)
  }
}

const mapDispatchToProps = {
  onValidatedTextChange: setPropertyAndError,
  onValidatorAndErrorChange: setError
}

export default connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps)(MathInputLHS)

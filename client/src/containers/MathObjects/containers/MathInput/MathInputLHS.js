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
import { getErrorMsg } from 'services/errors/selectors'
import { getValidateNameAgainst, getMathObjectProp } from './selectors'

import type { ErrorData } from 'services/errors'
import type { OtherProps } from './components/MathInput'
import type { Optionalize, OptionalizeSome } from 'utils/flow'

/**
 * @module MathInputLHS defines a connected version of MathInput for left-hand-
 * side expressions.
 */

 type DefaultProps = {|
   postProcessLaTeX: (string) => string,
   field: string
 |}
 type OwnProps = {|
   parentId: string,
   latex?: string,
   ...DefaultProps,
   ...Optionalize<OtherProps>
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
  onValidatorAndErrorChange: typeof setError,
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
    postProcessLaTeX: (latex: string) => latex,
    field: 'name'
  }

  constructor(props: Props) {
    super(props)
    // $FlowFixMe
    this.onValidatedTextChange = this.onValidatedTextChange.bind(this)
    // $FlowFixMe
    this.onValidatorAndErrorChange = this.onValidatorAndErrorChange.bind(this)
  }

  onValidatedTextChange(latex: string, error: ErrorData) {
    const { parentId, type, postProcessLaTeX, field } = this.props
    const processedLaTeX = postProcessLaTeX(latex)
    this.props.onValidatedTextChange(parentId, type, field, processedLaTeX, error)
  }

  onValidatorAndErrorChange(error: ErrorData) {
    const { parentId, field } = this.props
    this.props.onValidatorAndErrorChange(parentId, field, error)
  }

  render() {

    const {
      onValidatorAndErrorChange,
      onValidatedTextChange,
      parentId,
      type,
      field,
      ...otherProps
    } = this.props

    return (
      <MathInput
        {...otherProps}
        field={field}
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

type ConnectedOwnProps = OptionalizeSome<OwnProps, DefaultProps>
type ConnectedProps = OptionalizeSome<Props, DefaultProps>
export default connect<ConnectedProps, ConnectedOwnProps, _, _, _, _>(
  mapStateToProps, mapDispatchToProps
)(MathInputLHS)

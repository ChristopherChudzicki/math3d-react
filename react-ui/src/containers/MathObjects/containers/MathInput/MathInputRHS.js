// @flow
import React, { PureComponent } from 'react'
import MathInput from './components/MathInput'
import { connect } from 'react-redux'
import { setPropertyAndError } from 'containers/MathObjects/actions'
import { setError } from 'services/errors'
import type { ErrorData } from 'services/errors'
import { getErrorMsg } from 'services/errors/selectors'
import { getMathObjectProp } from './selectors'

/**
 * @module MathInputRHS defines a connected version of MathInput for right-hand-
 * side expressions.
 */

export type OwnProps = {|
  field: string,
  parentId: string,
  latex: ?string,
  prefix: ?string,
  postProcessLaTeX: (string) => string
|}
export type StateProps = {|
  type: string,
  latex: ?string,
  errorMsg: ?string
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

class MathInputRHS extends PureComponent<Props> {

  constructor(props: Props) {
    super(props)
    // $FlowFixMe
    this.onValidatedTextChange = this.onValidatedTextChange.bind(this)
    // $FlowFixMe
    this.onValidatorAndErrorChange = this.onValidatorAndErrorChange.bind(this)
  }

  static defaultProps = {
    postProcessLaTeX: (latex: string) => latex
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
        onValidatedTextChange={this.onValidatedTextChange}
        onValidatorAndErrorChange={this.onValidatorAndErrorChange}
      />
    )
  }

}

const mapStateToProps = ( { mathGraphics, mathSymbols, parseErrors, evalErrors, renderErrors }, ownProps) => {
  const { parentId, field, prefix } = ownProps
  const fullLatex = ownProps.latex
    ? ownProps.latex
    : getMathObjectProp( [mathGraphics, mathSymbols], parentId, field)
  const latex = prefix && fullLatex.startsWith(prefix)
    ? fullLatex.slice(prefix.length)
    : fullLatex
  return {
    type: getMathObjectProp( [mathGraphics, mathSymbols], parentId, 'type'),
    latex,
    errorMsg: getErrorMsg(parentId, field, parseErrors, evalErrors, renderErrors)
  }
}

const mapDispatchToProps = {
  onValidatedTextChange: setPropertyAndError,
  onValidatorAndErrorChange: setError
}

export default connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps)(MathInputRHS)

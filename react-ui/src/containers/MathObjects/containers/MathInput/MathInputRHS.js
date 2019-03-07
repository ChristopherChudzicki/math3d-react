// @flow
import * as React from 'react'
import MathInput from './components/MathInput'
import type { OtherProps } from './components/MathInput'
import type { Optionalize, OptionalizeSome } from 'utils/flow'
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

type DefaultProps = {|
  postProcessLaTeX: (string) => string,
|}
type OwnProps = {|
  field: string,
  parentId: string,
  latex?: string,
  ...DefaultProps,
  ...Optionalize<OtherProps>
|}
type StateProps = {|
  type: string,
  latex?: string,
  errorMsg?: string
|}
type DispatchProps = {|
  onValidatedTextChange: typeof setPropertyAndError,
  onValidatorAndErrorChange: typeof setError,
|}
type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|}

class MathInputRHS extends React.PureComponent<Props> {

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
  const fullLatex: string = ownProps.latex
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

type ConnectedOwnProps = OptionalizeSome<OwnProps, DefaultProps>
type ConnectedProps = OptionalizeSome<Props, DefaultProps>
export default connect<ConnectedProps, ConnectedOwnProps, _, _, _, _>(
  mapStateToProps, mapDispatchToProps
)(MathInputRHS)

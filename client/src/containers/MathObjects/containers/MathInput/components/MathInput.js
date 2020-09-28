// @flow
import * as React from 'react'
import { parser } from 'constants/parsing'
import type { Parser } from 'utils/mathParsing'
import type { MQMathField } from 'components/MathQuill'
import { MathQuillStyled } from './MathQuillStyled'
import { isAssignmentRHS } from './validators'
import styled from 'styled-components'
import { timeout } from 'utils/functions'
import { Tooltip } from 'antd'
import { ParseErrorData } from 'services/errors'

const MathInputContainer = styled.div`
  flex:1;
  align-self:stretch;
  display: flex;
`
const ErrorContainer = styled.div`
  min-height: 45px;
  width: 250px;
`

export type Validator = (parser: Parser, latex: string, validateAgainst: any) => ParseErrorData
type OnValidatorAndErrorChange = (ErrorData: ParseErrorData) => void
type OnValidatedTextChange = (latex: string, ErrorData: ParseErrorData) => void

export type OtherProps = {|
  // These have defaults
  parser: Parser,
  validators: Array<Validator>,
  size: 'small' | 'large',
  prefix: string,
  displayErrorDelay: number,
  allowEmpty: boolean,
  // These are optional
  style?: InlineStyle,
  className?: string,
  validateAgainst?: any,
  errorMsg?: string,
|}
type Props = {
  ...OtherProps,
  latex: string,
  onValidatorAndErrorChange: OnValidatorAndErrorChange,
  onValidatedTextChange: OnValidatedTextChange
}

type State = {
  isFocused: boolean,
  isPersistentError: boolean
}

export default class MathInput extends React.PureComponent<Props, State> {

  static defaultProps = {
    parser: parser,
    validators: [isAssignmentRHS],
    displayErrorDelay: 1500,
    size: 'large',
    prefix: '',
    allowEmpty: false
  }

  state = {
    isFocused: false,
    isPersistentError: false
  }

  // Internal Storage
  _errorId: ?Symbol
  _containerRef: { current: null | HTMLDivElement }

  constructor(props: Props) {
    super(props)
    this._containerRef = React.createRef()

    // $FlowFixMe
    this.getContainerRef = this.getContainerRef.bind(this)
    // $FlowFixMe
    this.onEdit = this.onEdit.bind(this)
    // $FlowFixMe
    this.onFocus = this.onFocus.bind(this)
    // $FlowFixMe
    this.onBlur = this.onBlur.bind(this)
  }

  static validate(
    validators: Array<Validator>,
    parser: Parser,
    latex: string,
    validateAgainst: any,
    allowEmpty: boolean=false
  ) {
    if (allowEmpty && latex.trim() === '') {
      return new ParseErrorData(null)
    }
    for (const validator of validators) {
      const parseErrorData = validator(parser, latex, validateAgainst)
      if (parseErrorData.isError) {
        return parseErrorData
      }
    }

    return new ParseErrorData(null)

  }

  getContainerRef() {
    // in rare cases, body can be null
    if (document.body === null) {
      throw new Error('document.body is null.')
    }
    // return body as default in case containing div hasn't rendered yet
    return this._containerRef.current || document.body
  }

  onEdit(mq: MQMathField) {
    const { prefix } = this.props
    const latex = mq.latex()
    const errorData = this.validateSelf(latex)
    this.props.onValidatedTextChange(prefix + latex, errorData)
  }
  onFocus() {
    this.setState( { isFocused: true } )
  }
  onBlur() {
    this.setState( { isFocused: false } )
  }

  async handleErrorPersistence(errorMsg: ?string) {
    if (!errorMsg) {
      this.setState( { isPersistentError: false } )
      this._errorId = null
      return
    }
    if (this.state.isPersistentError) {
      return
    }
    // Wait and see if error persists
    const errorId = Symbol('Error Identifier')
    this._errorId = errorId
    await timeout(this.props.displayErrorDelay)
    const sameError = errorId === this._errorId
    if (sameError && this._errorId) {
      this.setState( { isPersistentError: true } )
    }
  }
  displayErrorNow(errorMsg: ?string) {
    const isError = Boolean(errorMsg)
    this._errorId = isError ? Symbol('Error Identifier') : null
    this.setState( { isPersistentError: isError } )
  }

  validateSelf(latex: string) {
    const { validators, validateAgainst, parser, allowEmpty } = this.props
    return MathInput.validate(validators, parser, latex, validateAgainst, allowEmpty)
  }

  componentDidMount() {
    const { latex } = this.props
    const errorData = this.validateSelf(latex)
    const changed = errorData.errorMsg !== this.props.errorMsg
    if (changed) {
      this.props.onValidatorAndErrorChange(errorData)
      this.handleErrorPersistence(errorData.errorMsg)
    }
    if (errorData.errorMsg) {
      this.displayErrorNow(errorData.errorMsg)
    }
    // force re-render after container has rendered
    this.forceUpdate()
  }

  componentDidUpdate(prevProps: Props) {

    const {
      validators,
      validateAgainst,
      latex,
      errorMsg
    } = this.props

    const validatorsChange = validators !== prevProps.validators ||
      validateAgainst !== prevProps.validateAgainst

    if (validatorsChange) {
      const errorData = this.validateSelf(latex)
      const changed = errorData.errorMsg !== this.props.errorMsg
      if (changed) {
        this.props.onValidatorAndErrorChange(errorData)
        this.handleErrorPersistence(errorData.errorMsg)
      }
    }

    const errorMsgChanged = errorMsg !== prevProps.errorMsg
    if (errorMsgChanged) {
      this.handleErrorPersistence(errorMsg)
    }

  }

  render() {
    const { isPersistentError, isFocused } = this.state
    return (
      <MathInputContainer
        className={this.props.className}
        style={this.props.style}
        ref={this._containerRef}
      >
        <Tooltip
          getPopupContainer={this.getContainerRef}
          visible={isPersistentError && isFocused}
          title={
            <ErrorContainer>
              {this.props.errorMsg}
            </ErrorContainer>
          }
          trigger='click'
          placement='topLeft'
        />
        <MathQuillStyled
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          style={this.props.style}
          hasError={isPersistentError}
          latex={this.props.latex}
          onEdit={this.onEdit}
          size={this.props.size}
          autoCommands='sqrt pi theta phi'
          autoOperatorNames='diff pdiff curl div unitT unitN unitB cosh sinh tanh arccosh arcsinh arctanh cos sin tan sec csc cot arcsin arccos arctan log ln exp mod abs norm max min'
        />
      </MathInputContainer>
    )
  }

}

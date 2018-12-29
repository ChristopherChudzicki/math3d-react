import React, { PureComponent } from 'react'
import { parser } from 'constants/parsing'
import PropTypes from 'prop-types'
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

export default class MathInput extends PureComponent {

  static validate(validators, parser, latex, validateAgainst, allowEmpty=false) {
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

  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    field: PropTypes.string.isRequired,
    parser: PropTypes.object.isRequired,
    validators: PropTypes.arrayOf(PropTypes.func).isRequired,
    validateAgainst: PropTypes.any,
    size: PropTypes.oneOf( ['small', 'large'] ).isRequired,
    allowEmpty: PropTypes.bool.isRequired,
    // (prop, latex, error) => ...
    onValidatedTextChange: PropTypes.func.isRequired,
    prefix: PropTypes.string.isRequired,
    // (prop, error) => ...
    onValidatorAndErrorChange: PropTypes.func.isRequired,
    errorMsg: PropTypes.string,
    latex: PropTypes.string.isRequired,
    displayErrorDelay: PropTypes.number.isRequired // ms
  }

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

  constructor(props) {
    super(props)
    this.assignContainerRef = this.assignContainerRef.bind(this)
    this.getContainerRef = this.getContainerRef.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  assignContainerRef(ref) {
    this._ref = ref
  }
  getContainerRef() {
    // return body as default in case containing div hasn't rendered yet
    return this._ref ? this._ref : document.body
  }
  onEdit(mq) {
    const { prefix } = this.props
    const latex = mq.latex()
    const errorData = this.validateSelf(latex)
    this.props.onValidatedTextChange(this.props.field, prefix + latex, errorData)
  }
  onFocus() {
    this.setState( { isFocused: true } )
  }
  onBlur() {
    this.setState( { isFocused: false } )
  }

  async handleErrorPersistence(errorMsg) {
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
  displayErrorNow(errorMsg) {
    const isError = Boolean(errorMsg)
    this._errorId = isError ? Symbol('Error Identifier') : null
    this.setState( { isPersistentError: isError } )
  }

  validateSelf(latex) {
    const { validators, validateAgainst, parser, allowEmpty } = this.props
    return MathInput.validate(validators, parser, latex, validateAgainst, allowEmpty)
  }

  componentDidMount() {
    const { latex, field } = this.props
    const errorData = this.validateSelf(latex)
    const changed = errorData.errorMsg !== this.props.errorMsg
    if (changed) {
      this.props.onValidatorAndErrorChange(field, errorData)
      this.handleErrorPersistence(errorData.errorMsg)
    }
    if (errorData.errorMsg) {
      this.displayErrorNow(errorData.errorMsg)
    }
    // force re-render after container has rendered
    this.forceUpdate()
  }

  componentDidUpdate(prevProps) {

    const {
      validators,
      validateAgainst,
      latex,
      field,
      errorMsg
    } = this.props

    const validatorsChange = validators !== prevProps.validators ||
      validateAgainst !== prevProps.validateAgainst

    if (validatorsChange) {
      const errorData = this.validateSelf(latex)
      const changed = errorData.errorMsg !== this.props.errorMsg
      if (changed) {
        this.props.onValidatorAndErrorChange(field, errorData)
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
        ref={this.assignContainerRef}
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
          onVisibleChange={this.handleVisibleChange}
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
          autoOperatorNames='diff unitT unitN unitB cos sin tan sec csc cot log ln exp mod'
        />
      </MathInputContainer>
    )
  }

}

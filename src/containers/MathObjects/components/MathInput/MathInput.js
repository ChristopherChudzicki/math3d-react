import React, { PureComponent } from 'react'
import { parser } from 'constants/parsing'
import PropTypes from 'prop-types'
import { MathQuillLarge } from './MathQuillStyled'
import { isAssignmentRHS } from './validators'
import styled from 'styled-components'
import { timeout } from 'utils/functions'
import { Tooltip } from 'antd'

const MathInputContainer = styled.div`
  flex:1;
  align-self:stretch;
  display: flex;
`
const ErrorContainer = styled.div`
  min-height: 45px;
  width: 250px;
`

// TODO
// Currently, onEdit triggers two error updates:
// 1. when the edit occurs
// 2. from onErrorChange.
//
// Remove props onErrorChange and onTextChange, switch to
// onValidatedTextChange(prop, latex, error)
// onValidatorChange(prop, error)
//
// will mess up my tests....

export default class MathInput extends PureComponent {

  static validate(validators, parser, latex, validateAgainst) {

    for (const validator of validators) {
      const { isValid, errorMsg } = validator(parser, latex, validateAgainst)
      if (errorMsg) {
        return { isValid, errorMsg }
      }
    }

    return { isValid: true }

  }

  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    field: PropTypes.string.isRequired,
    parser: PropTypes.object.isRequired,
    size: PropTypes.oneOf( ['large', 'small'] ).isRequired, // TODO: implement this
    validators: PropTypes.arrayOf(PropTypes.func).isRequired,
    validateAgainst: PropTypes.any,
    // (latex) => ...
    onTextChange: PropTypes.func.isRequired,
    // (errorProp, errorMsg) => ...
    onErrorChange: PropTypes.func.isRequired,
    errorMsg: PropTypes.string,
    latex: PropTypes.string.isRequired,
    displayErrorDelay: PropTypes.number.isRequired // ms
  }

  static defaultProps = {
    parser: parser,
    size: 'large',
    validators: [isAssignmentRHS],
    displayErrorDelay: 1500
  }

  static getDerivedStateFromProps(props) {
    return { hasError: Boolean(props.errorMsg) }
  }

  state = {
    hasError: false,
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
    const latex = mq.latex()
    const error = {
      errorType: 'PARSE_ERROR',
      errorMsg: this.detectErrors(latex)
    }
    this.props.onTextChange(this.props.field, latex, error)
  }
  onFocus() {
    this.setState( { isFocused: true } )
  }
  onBlur() {
    this.setState( { isFocused: false } )
  }

  async onErrorChange(errorProp, errorMsg) {
    this.props.onErrorChange(errorProp, { errorType: 'PARSE_ERROR', errorMsg } )
    if (!errorMsg) {
      this.setState( { isPersistentError: false } )
      this._errorId = null
      return
    }

    // Wait and see if error persists
    const errorId = Symbol('Error Identifier')
    this._errorId = errorId
    await timeout(this.props.displayErrorDelay)
    const sameError = (errorId === this._errorId) && errorMsg
    if (sameError) {
      this.setState( { isPersistentError: true } )
    }

  }

  detectErrors(latex) {
    const {
      validators,
      validateAgainst,
      field: errorProp,
      errorMsg
    } = this.props
    const {
      errorMsg: newErrorMsg
    } = MathInput.validate(validators, parser, latex, validateAgainst)
    if (errorMsg !== newErrorMsg) {
      this.onErrorChange(errorProp, newErrorMsg)
    }
    return newErrorMsg
  }

  componentDidMount() {
    const newErrorMsg = this.detectErrors(this.props.latex)
    // If errors are present upon mounting, declare them persistent immediately
    if (newErrorMsg) {
      this.setState( { isPersistentError: true } )
    }
    // force re-render after container has rendered
    this.forceUpdate()
  }

  componentDidUpdate(prevProps) {
    const {
      validators,
      validateAgainst,
      latex
    } = this.props

    const needsValidation = latex !== prevProps.latex || validators !== prevProps.validators ||
     validateAgainst !== prevProps.validateAgainst

    if (!needsValidation) {
      return
    }

    this.detectErrors(latex)

  }

  render() {
    const { isPersistentError, isFocused } = this.state
    return (
      <MathInputContainer
        className={this.props.className}
        style={this.props.style}
        innerRef={this.assignContainerRef}
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
        <MathQuillLarge
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          style={this.props.style}
          hasError={isPersistentError}
          latex={this.props.latex}
          onEdit={this.onEdit}
        />
      </MathInputContainer>
    )
  }

}

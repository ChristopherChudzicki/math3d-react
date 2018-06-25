import React, { PureComponent } from 'react'
import { parser } from 'constants/parsing'
import PropTypes from 'prop-types'
import { MathQuillLarge } from './MathQuillStyled'
import { isAssignmentRHS } from './validators'
import styled from 'styled-components'
import { timeout } from 'utils/functions'
import { Tooltip } from 'antd'
import { PARSE_ERROR } from 'containers/MathObjects/mathObjectTypes'

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

  static validate(validators, parser, latex, validateAgainst) {

    for (const validator of validators) {
      const { isValid, errorMsg } = validator(parser, latex, validateAgainst)
      if (!isValid) {
        return { errorType: PARSE_ERROR, isValid, errorMsg }
      }
    }

    return { isValid: true, errorType: PARSE_ERROR }

  }

  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    field: PropTypes.string.isRequired,
    parser: PropTypes.object.isRequired,
    size: PropTypes.oneOf( ['large', 'small'] ).isRequired, // TODO: implement this
    validators: PropTypes.arrayOf(PropTypes.func).isRequired,
    validateAgainst: PropTypes.any,
    // (prop, latex, error) => ...
    onValidatedTextChange: PropTypes.func.isRequired,
    // (prop, error) => ...
    onValidatorAndErrorChange: PropTypes.func.isRequired,
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
    const latex = mq.latex()
    const error = this.validateSelf(latex)
    this.props.onValidatedTextChange(this.props.field, latex, error)
    this.handleErrorPersistence(error.errorMsg)
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
    const { validators, validateAgainst, parser } = this.props
    return MathInput.validate(validators, parser, latex, validateAgainst)
  }

  componentDidMount() {
    if (this.props.errorMsg) {
      this.displayErrorNow(this.props.errorMsg)
    }
    // force re-render after container has rendered
    this.forceUpdate()
  }

  componentDidUpdate(prevProps) {

    const {
      validators,
      validateAgainst,
      latex,
      field
    } = this.props

    const validatorsChange = validators !== prevProps.validators ||
      validateAgainst !== prevProps.validateAgainst

    if (!validatorsChange) {
      return
    }

    const error = this.validateSelf(latex)
    const changed = error.errorMsg !== this.props.errorMsg
    if (changed) {
      this.props.onValidatorAndErrorChange(field, error)
      this.handleErrorPersistence(error.errorMsg)
    }

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

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

export default class MathInput extends PureComponent {

  static validate(validators, parser, latex) {

    for (const validator of validators) {
      const { isValid, errorMsg } = validator(parser, latex)
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
    this.props.onTextChange(latex)
  }
  onFocus() {
    this.setState( { isFocused: true } )
  }
  onBlur() {
    this.setState( { isFocused: false } )
  }

  componentDidMount() {
    const {
      validators,
      field: errorProp,
      errorMsg,
      latex
    } = this.props
    const {
      errorMsg: newErrorMsg
    } = MathInput.validate(validators, parser, latex)
    if (errorMsg !== newErrorMsg) {
      this.onErrorChange(errorProp, newErrorMsg)
    }
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
      errorMsg,
      parser,
      latex,
      field: errorProp
    } = this.props

    const needsValidation = validators !== prevProps.validators ||
      latex !== prevProps.latex

    if (!needsValidation) {
      return
    }

    const {
      errorMsg: newErrorMsg
    } = MathInput.validate(validators, parser, latex)
    if (errorMsg !== newErrorMsg) {
      this.onErrorChange(errorProp, newErrorMsg)
    }

  }

  async onErrorChange(errorProp, errorMsg) {
    this.props.onErrorChange(errorProp, errorMsg)
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

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// mathquill.js requires window.jQuery; probably best to load from a CDN
import 'mathquill/build/mathquill.js'
import 'mathquill/build/mathquill.css'

const MQ = window.MathQuill.getInterface(2)

export default class MathQuill extends PureComponent {

  // For configuration details, see http://docs.mathquill.com/en/latest/Config/#setting-configuration
  // Outer Span CSS Info:
  //   default classes: .mq-editable-field.mq-math-mode
  //   when focused: .mq-focused

  static propTypes = {
    latex: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    // Configuration options
    spaceBehavesLikeTab: PropTypes.bool,
    leftRightIntoCmdGoes: PropTypes.string,
    restrictMismatchedBrackets: PropTypes.bool,
    sumStartsWithNEquals: PropTypes.bool,
    supSubsRequireOperand: PropTypes.bool,
    charsThatBreakOutOfSupSub: PropTypes.string,
    autoSubscriptNumerals: PropTypes.bool,
    autoCommands: PropTypes.string,
    autoOperatorNames: PropTypes.string,
    substituteTextarea: PropTypes.func,
    // Config Event Handlers
    onEnter: PropTypes.func,
    onEdit: PropTypes.func,
    onMoveOutOf: PropTypes.func,
    onDeleteOutOf: PropTypes.func,
    onUpOutOf: PropTypes.func,
    onSelectOutOf: PropTypes.func,
    onDownOutOf: PropTypes.func
  }

  static configKeys = new Set( [
    'spaceBehavesLikeTab',
    'leftRightIntoCmdGoes',
    'restrictMismatchedBrackets',
    'sumStartsWithNEquals',
    'supSubsRequireOperand',
    'charsThatBreakOutOfSupSub',
    'autoSubscriptNumerals',
    'autoCommands',
    'autoOperatorNames',
    'substituteTextarea'
  ] )

  static handlerKeys = {
    onEnter: 'enter',
    // onEdit: 'edit', onEdit is handled separately
    onMoveOutOf: 'moveOutOf',
    onDeleteOutOf: 'deleteOutOf',
    onUpOutOf: 'upOutOf',
    onSelectOutOf: 'selectOutOf',
    onDownOutOf: 'downOutOf'
  }

  getConfig(props) {
    const config = Object.keys(props)
      .filter(prop => MathQuill.configKeys.has(prop))
      .reduce((theConfig, prop) => {
        theConfig[prop] = props[prop]
        return theConfig
      }, {} )

    config.handlers = {
      edit: this.onEdit
    }

    // Add remaining handlers and return
    return Object.keys(props)
      .filter(prop => MathQuill.handlerKeys[prop] )
      .reduce((theConfig, prop) => {
        theConfig.handlers[prop] = props[prop]
        return theConfig
      }, config)
  }

  componentDidMount = () => {
    const config = this.getConfig(this.props)
    const mathField = MQ.MathField(this._span, config)

    // mathField.latex will trigger onEdit, but let's
    // not do that the first time. This is initialization, not edit.
    this.preventOnEdit = true
    mathField.latex(this.props.latex)
    this.preventOnEdit = false
  }

  onEdit = (mathField) => {
    const handler = this.props.onEdit

    if (handler && !this.preventOnEdit) {
      handler(mathField)
    }

    if (this.props.latex !== mathField.latex()) {
      mathField.latex(this.props.latex)
    }

  }

  render() {
    return (
      <span
        style={this.props.style}
        className={this.props.className}
        ref={ ref => { this._span = ref } }>
      </span>
    )
  }

}

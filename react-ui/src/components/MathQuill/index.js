/* @flow */
import React, { PureComponent } from 'react'
// mathquill.js requires window.jQuery; probably best to load from a CDN
import 'mathquill/build/mathquill.js'
// $FlowFixMe flow doesn't like css imports and I only have a few.
import 'mathquill/build/mathquill.css'
import classNames from 'classnames'

const MQ = window.MathQuill.getInterface(2)

type MQMathField = {
  latex: Function
}

type MathQuillProps = {
  latex: string,
  style?: Object,
  className?: string,
  // MQ Config:
  spaceBehavesLikeTab?: boolean,
  leftRightIntoCmdGoes?: string,
  restrictMismatchedBrackets?: boolean,
  sumStartsWithNEquals?: boolean,
  supSubsRequireOperand?: boolean,
  charsThatBreakOutOfSupSub?: string,
  autoSubscriptNumerals?: boolean,
  autoCommands?: string,
  autoOperatorNames?: string,
  substituteTextarea?: Function,
  // MathQuill Config Event Handlers
  // MathQuill actually names them handler.edit, handler.enter, etc
  onEnter?: Function,
  onEdit?: Function,
  onMoveOutOf?: Function,
  onDeleteOutOf?: Function,
  onUpOutOf?: Function,
  onSelectOutOf?: Function,
  onDownOutOf?: Function,
  // Extra React Event Handlers
  onFocus?: Function,
  onBlur?: Function,
}

type MathQuillState = {
  isFocused: boolean
}

export default class MathQuill extends PureComponent
  <MathQuillProps, MathQuillState> {

  mathField: MQMathField
  span: ?HTMLSpanElement
  preventOnEdit: bool

  state = {
    isFocused: false
  }

  static configKeys = [
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
  ]

  static handlerKeys = {
    onEnter: 'enter',
    // onEdit: 'edit', onEdit is handled separately
    onMoveOutOf: 'moveOutOf',
    onDeleteOutOf: 'deleteOutOf',
    onUpOutOf: 'upOutOf',
    onSelectOutOf: 'selectOutOf',
    onDownOutOf: 'downOutOf'
  }

  getConfig(props: MathQuillProps) {

    const config = MathQuill.configKeys
      .filter(prop => props[prop] )
      .reduce((theConfig, prop) => {
        theConfig[prop] = props[prop]
        return theConfig
      }, {} )

    config.handlers = { }
    config.handlers.edit = this.onEdit

    // Add remaining handlers and return
    return Object.keys(MathQuill.handlerKeys)
      .filter(prop => props[prop] )
      .reduce((theConfig, prop) => {
        const handlerKey = MathQuill.handlerKeys[prop]
        theConfig.handlers[handlerKey] = props[prop]
        return theConfig
      }, config)
  }

  componentDidMount() {
    const config = this.getConfig(this.props)
    this.mathField = MQ.MathField(this.span, config)
    this.setLatex(this.props.latex)
  }

  setLatex(latex: string) {
    if (latex === this.mathField.latex()) {
      return
    }
    // mathField.latex will trigger onEdit, so supress that.
    this.preventOnEdit = true
    this.mathField.latex(this.props.latex)
    this.preventOnEdit = false
  }

  componentDidUpdate() {
    this.setLatex(this.props.latex)
  }

  onEdit = (mathField: MQMathField) => {
    const handler = this.props.onEdit

    if (handler && !this.preventOnEdit) {
      handler(mathField)
    }

  }

  onFocus = () => {
    this.setState( { isFocused: true } )
    if (this.props.onFocus) {
      this.props.onFocus()
    }
  }
  onBlur = () => {
    this.setState( { isFocused: false } )
    if (this.props.onBlur) {
      this.props.onBlur()
    }
  }

  render() {
    // Setting classes through react overrides the custom mathquill classes
    // unless we also set the mq classes through react.
    const mqClasses = classNames(this.props.className, {
      'mq-editable-field': true,
      'mq-math-mode': true,
      'mq-focused': this.state.isFocused
    } )
    return (
      <span
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        style={this.props.style}
        className={mqClasses}
        ref={ ref => { this.span = ref } }>
      </span>
    )
  }

}

type StaticMathProps = {
  latex?: string,
  style?: Object,
  className?: string,
};

type MQStaticMath = {
  latex: Function
}

export class StaticMath extends PureComponent<StaticMathProps> {

  staticMath: MQStaticMath
  span: ?HTMLSpanElement

  componentDidMount() {
    this.staticMath = MQ.StaticMath(this.span)
  }

  componentDidUpdate() {
    if (this.props.latex !== this.staticMath.latex()) {
      this.staticMath.latex(this.props.latex)
    }
  }

  render() {
    const mqClasses = classNames(this.props.className, {
      'mq-math-mode': true
    } )
    return (
      <span
        style={this.props.style}
        className={mqClasses}
        ref={ ref => { this.span = ref } }>
        {this.props.latex}
      </span>
    )
  }

}

// @flow
import React, { PureComponent } from 'react'
import { Slider } from 'antd'
import type { Scope, Parser } from 'utils/mathParsing'
import {
  evalData,
  handleEvalErrors
} from 'services/evalData'
import typeof { setError as SetError } from 'services/errors'

type Props = {
  parentId: string,
  value: string,
  min: string,
  max: string,
  onSliderChange: (value: number) => void,
  scope: Scope,
  parser: Parser,
  ownEvalErrors: { [prop: string]: string },
  setError: SetError
}

type State = {
  min: number,
  max: number,
  value: number
}

type NewErrors = {
  min?: Error,
  max?: Error,
  value?: Error
}
export default class EvaluatedSlider extends PureComponent<Props, State> {

  // Stores the last valid evaluation result
  state = {
    min: -10,
    max: -10,
    value: 0
  }

  static computedProps = ['min', 'max', 'value']

  static getDerivedStateFromProps(props: Props, state: State) {
    const { parser, parentId, scope, ownEvalErrors, setError, min, max, value } = props
    const needsEval = { min, max, value }
    const result = evalData(parser, needsEval, scope)
    const { evaluated } = result
    const newErrors: NewErrors = result.evalErrors
    Object.keys(evaluated).forEach(prop => {
      if (typeof evaluated[prop] !== 'number') {
        delete evaluated[prop]
        newErrors[prop] = TypeError(`'${prop}' must be a number.`)
      }
    } )

    // Validate some stuff
    const newState = { ...state, ...evaluated }
    if (newState.min > newState.max) {
      newErrors.min = newErrors.min || TypeError(`Range Error: 'min' (${newState.min}) cannot be greater than  'max' (${newState.max})`)
      newErrors.max = newErrors.max || TypeError(`Range Error: 'max' (${newState.max}) cannot be less than 'min' (${newState.min})`)
      delete newState.min
      delete newState.max
    }
    else if (newState.min === newState.max) {
      newErrors.min = newErrors.min || TypeError(`Range Error: 'min' (${newState.min}) cannot equal 'max' (${newState.max})`)
      newErrors.max = newErrors.max || TypeError(`Range Error: 'max' (${newState.max}) cannot equal 'min' (${newState.min})`)
      delete newState.min
      delete newState.max
    }

    handleEvalErrors(parentId, newErrors, ownEvalErrors, setError)
    return newState
  }

  constructor(props: Props) {
    super(props)
    // $FlowFixMe
    this.incrementByFraction = this.incrementByFraction.bind(this)
  }

  incrementByFraction(fraction: number) {
    console.log(fraction)
    const { min, max, value } = this.state
    const amount = value + (max - min) * fraction
    if (amount < max) {
      this.props.onSliderChange(amount)
    }
    else {
      this.props.onSliderChange(min)
    }
  }

  render() {
    const { min, max, value } = this.state
    const step = (max - min)/100
    return (
      <div style={ { flex: 1 } }>
        <Slider
          // if min>max, onChange can enter an infinite loop
          min={min}
          max={max}
          tipFormatter={null}
          value={value}
          step={step}
          onChange={this.props.onSliderChange}
        />
      </div>
    )
  }

}

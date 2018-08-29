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

export default class EvaluatedSlider extends PureComponent<Props, State> {

  // Stores the last valid evaluation result
  state = {
    min: -10,
    max: -10,
    value: 0
  }

  static computedProps = ['min', 'max', 'value']

  static getDerivedStateFromProps(props: Props) {
    const { parser, parentId, scope, ownEvalErrors, setError, min, max, value } = props
    const needsEval = { min, max, value }
    const {
      evalErrors: newErrors,
      evaluated
    } = evalData(parser, needsEval, scope)
    handleEvalErrors(parentId, newErrors, ownEvalErrors, setError)
    // TODO: This needs validation to prevent non-scalar values
    return { props, ...evaluated }
  }

  render() {
    const { min, max, value } = this.state
    return (
      <div style={ { flex: 1 } }>
        <Slider
          min={min}
          max={max}
          tipFormatter={null}
          value={value}
          step={0.01}
          onChange={this.props.onSliderChange}
        />
      </div>
    )
  }

}

// @flow
import React, { PureComponent } from 'react'
import { Slider } from 'antd'
import type { Scope, Parser } from 'utils/mathParsing'
import { evalData } from 'containers/MathBoxScene/components/MathBoxScene'
import typeof { setError as SetError } from 'services/errors'

type Props = {
  parentId: string,
  value: string,
  min: string,
  max: string,
  onSliderChange: (value: number) => void,
  scope: Scope,
  parser: Parser,
  evalErrors: {},
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
    const { parentId, scope, evalErrors, setError, min, max, value } = props
    const needsEval = { min, max, value }
    const data = evalData(parentId, needsEval, EvaluatedSlider.computedProps, scope, evalErrors, setError)
    // TODO: This needs validation to prevent non-scalar values
    return data
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

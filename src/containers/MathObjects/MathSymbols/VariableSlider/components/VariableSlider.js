// @flow
import type { Scope } from 'utils/mathParsing/MathExpression'
import typeof { setError as SetError } from 'services/errors'
import React, { PureComponent } from 'react'
import MathObjectUI from 'containers/MathObjects/MathObjectUI'
import {
  MainRow
} from 'containers/MathObjects/components'
import { VARIABLE_SLIDER } from '../metadata'
import SliderValueDisplay from './SliderValueDisplay'
import EvaluatedSlider from './EvaluatedSlider'
import AnimationControls from './AnimationControls'
import { MathInputRHS } from 'containers/MathObjects/containers/MathInput'
import { MathScopeConsumer } from 'containers/MathScopeContext'
import { parser } from 'constants/parsing'

const limitStyle = { flex: 0 }

type Props = {
  id: string,
  isAnimating: bool,
  fps: number,
  baseAnimationDuration: number,
  animationMultiplier: number,
  value: number,
  manualValue?: string, // entered in MathQuill by user
  min: string,
  max: string,
  setSliderValue: (id: string, value: number, previousValueIsManual: bool) => void,
  evalErrors: {},
  setError: SetError
}

export default class VariableSlider extends PureComponent<Props> {

  static defaultProps = {
    isAnimating: false,
    fps: 30,
    baseAnimationDuration: 4,
    animationMultiplier: 1
  }

  constructor(props: Props) {
    super(props)
    // $FlowFixMe
    this.onSliderChange = this.onSliderChange.bind(this)
    // $FlowFixMe
    this.renderSlider = this.renderSlider.bind(this)
  }

  onSliderChange(value: number) {
    const { id, manualValue } = this.props
    const previousValueIsManual = manualValue === null
    this.props.setSliderValue(id, value, previousValueIsManual)
  }

  render() {
    const {
      id,
      value,
      manualValue
    } = this.props
    const valueText = manualValue || value.toFixed(2)
    return (
      <MathObjectUI
        id={id}
        type={VARIABLE_SLIDER}
      >
        <MainRow>
          <SliderValueDisplay
            parentId={id}
            valueText={valueText}
          />
          <AnimationControls />
        </MainRow>
        <MainRow>
          <MathInputRHS
            parentId={id}
            style={limitStyle}
            field='min'
          />
          <MathScopeConsumer>
            {this.renderSlider}
          </MathScopeConsumer>
          <MathInputRHS
            parentId={id}
            style={limitStyle}
            field='max'
          />
        </MainRow>
      </MathObjectUI>
    )
  }

  renderSlider( { scope }: { scope: Scope } ) {
    const { manualValue, value } = this.props
    const valueText = manualValue || value.toFixed(2)
    return (
      <EvaluatedSlider
        parentId={this.props.id}
        value={valueText}
        min={this.props.min}
        max={this.props.max}
        onSliderChange={this.onSliderChange}
        scope={scope}
        parser={parser}
        evalErrors={this.props.evalErrors}
        setError={this.props.setError}
      />
    )
  }

}

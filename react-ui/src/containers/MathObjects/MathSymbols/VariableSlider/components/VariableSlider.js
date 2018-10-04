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
import typeof {
  setProperty as SetProperty
} from 'containers/MathObjects/actions'

const limitStyle = { flex: 0 }

type Props = {
  setProperty: SetProperty,
  id: string,
  isAnimating: bool,
  fps: number,
  baseAnimationDuration: number,
  speedMultiplier: number,
  value: number,
  manualValue?: string, // entered in MathQuill by user
  min: string,
  max: string,
  setSliderValue: (id: string, value: number, previousValueIsManual: bool) => void,
  ownEvalErrors: {},
  setError: SetError
}

export default class VariableSlider extends PureComponent<Props> {

  _evaluatedSlider: ?EvaluatedSlider

  static defaultProps = {
    isAnimating: false,
    fps: 30,
    baseAnimationDuration: 4,
    speedMultiplier: 1
  }

  constructor(props: Props) {
    super(props)
    // $FlowFixMe
    this.setProperty = this.setProperty.bind(this)
    // $FlowFixMe
    this.onSliderChange = this.onSliderChange.bind(this)
    // $FlowFixMe
    this.renderSlider = this.renderSlider.bind(this)
  }

  setProperty(property: string, value: any) {
    this.props.setProperty(this.props.id, VARIABLE_SLIDER, property, value)
  }

  onSliderChange(value: number) {
    const { id, manualValue } = this.props
    const previousValueIsManual = manualValue !== null
    this.props.setSliderValue(id, value, previousValueIsManual)
  }

  componentDidMount() {
    // Force re-render once this._evaluatedSlider has been assigned
    this.forceUpdate()
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
          {this._evaluatedSlider &&
            <AnimationControls
              setProperty={this.setProperty}
              isAnimating={this.props.isAnimating}
              speedMultiplier={this.props.speedMultiplier}
              incrementByFraction={this._evaluatedSlider.incrementByFraction}
            />
          }
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
        ref={ref => { this._evaluatedSlider = ref }}
        parentId={this.props.id}
        value={valueText}
        min={this.props.min}
        max={this.props.max}
        onSliderChange={this.onSliderChange}
        scope={scope}
        parser={parser}
        ownEvalErrors={this.props.ownEvalErrors}
        setError={this.props.setError}
      />
    )
  }

}

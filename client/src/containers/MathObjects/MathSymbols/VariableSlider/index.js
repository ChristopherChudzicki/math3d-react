// @flow
import type { Dispatch } from 'redux'
import { MathSymbol } from '../../../../containers/MathObjects/MathObject'
import VariableSlider from './components/VariableSlider'
import { connect } from 'react-redux'
import { setPropertyAndError, setProperty } from '../../../../containers/MathObjects/actions'
import { setSliderValue } from './actions'
import { ParseErrorData, setError } from '../../../../services/errors'
import { defaultSettings, VARIABLE_SLIDER } from './metadata'

const mapStateToProps = ( { mathSymbols, sliderValues, evalErrors }, ownProps) => {
  const { id } = ownProps
  const mathSymbol = mathSymbols[id]
  return {
    name: mathSymbol.name,
    value: sliderValues[id], // number
    manualValue: mathSymbol.value, // nullable string
    min: mathSymbol.min,
    max: mathSymbol.max,
    ownEvalErrors: evalErrors[id],
    isAnimating: mathSymbol.isAnimating,
    speedMultiplier: mathSymbol.speedMultiplier
  }
}

const mapDispatchToProps = (dispatch: Dispatch<*>) => ( {
  setProperty: (id, type, property, value) => dispatch(setProperty(id, type, property, value)),
  setError: (id, property, errorData) => dispatch(setError(id, property, errorData)),
  setSliderValue: (id, value, previousValueIsManual) => {
    // set the slider value
    dispatch(setSliderValue(id, value))
    // reset valueText and clear parse errors if necessary
    if (previousValueIsManual) {
      const error = new ParseErrorData()
      dispatch(setPropertyAndError(id, VARIABLE_SLIDER, 'value', null, error))
    }
  }
} )

export default new MathSymbol( {
  type: VARIABLE_SLIDER,
  defaultSettings: defaultSettings,
  uiComponent: connect(mapStateToProps, mapDispatchToProps)(VariableSlider)
} )

export { VARIABLE_SLIDER }

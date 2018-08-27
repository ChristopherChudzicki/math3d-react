// @flow
import type { Dispatch } from 'redux'
import { MathSymbol } from 'containers/MathObjects/MathObject'
import VariableSlider from './components/VariableSlider'
import { connect } from 'react-redux'
import { setPropertyAndError } from 'containers/MathObjects/actions'
import { setSliderValue } from './actions'
import { ParseErrorData, setError } from 'services/errors'
import { defaultSettings, VARIABLE_SLIDER } from './metadata'

const mapStateToProps = ( { mathSymbols, sliderValues, evalErrors }, ownProps) => {
  const { id } = ownProps
  const filteredEvalErrors = { [id]: evalErrors[id] }
  return {
    name: mathSymbols[id].name,
    value: sliderValues[id], // number
    manualValue: mathSymbols[id].value, // nullable string
    min: mathSymbols[id].min,
    max: mathSymbols[id].max,
    evalErrors: filteredEvalErrors
  }
}

const mapDispatchToProps = (dispatch: Dispatch<*>) => ( {
  setError,
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

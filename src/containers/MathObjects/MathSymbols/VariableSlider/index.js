// @flow
import type { Dispatch } from 'redux'
import { MathSymbol } from 'containers/MathObjects/MathObject'
import VariableSlider from './components/VariableSlider'
import { connect } from 'react-redux'
import { setPropertyAndError } from 'containers/MathObjects/actions'
import { setSliderValue } from './actions'
import { ParseErrorData } from 'services/errors'
import { defaultSettings, VARIABLE_SLIDER } from './metadata'

const mapStateToProps = ( { mathSymbols, sliderValues }, ownProps) => {
  const { id } = ownProps
  return {
    name: mathSymbols[id].name,
    value: sliderValues[id], // number
    valueText: mathSymbols[id].value // nullable string
  }
}

const mapDispatchToProps = (dispatch: Dispatch<*>) => ( {
  setSliderValue: (id, type, valueText, value) => {
    // set the slider value
    dispatch(setSliderValue(id, value))
    // reset valueText and clear parse errors if necessary
    if (valueText !== null) {
      const error = new ParseErrorData()
      dispatch(setPropertyAndError(id, type, 'value', null, error))
    }
  }
} )

export default new MathSymbol( {
  type: VARIABLE_SLIDER,
  defaultSettings: defaultSettings,
  uiComponent: connect(mapStateToProps, mapDispatchToProps)(VariableSlider)
} )

export { VARIABLE_SLIDER }

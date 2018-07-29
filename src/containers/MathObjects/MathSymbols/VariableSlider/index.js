import VariableSlider from './components/VariableSlider'
import { connect } from 'react-redux'
import { setPropertyAndError } from 'containers/MathObjects/actions'
import { setError } from 'services/errors'
import { getErrors } from 'services/errors/selectors'
import { VARIABLE_SLIDER, setSliderValue } from './actions'
import { getValidateNameAgainst } from '../selectors'
import { parser } from 'constants/parsing'

const mapStateToProps = ( { mathSymbols, sliderValues, parseErrors, evalErrors }, ownProps) => {
  const { id } = ownProps
  return {
    name: mathSymbols[id].name,
    min: mathSymbols[id].min,
    max: mathSymbols[id].max,
    value: sliderValues[id], // number
    valueText: mathSymbols[id].value, // nullable string
    errors: getErrors(id, parseErrors, evalErrors),
    validateNameAgainst: getValidateNameAgainst(parser, mathSymbols, id)
  }
}

const mapDispatchToProps = dispatch => ( {
  setSliderValue: (id, type, valueText, value) => {
    // set the slider value
    dispatch(setSliderValue(id, value))
    // reset valueText and clear parse errors if necessary
    if (valueText !== null) {
      const error = { type: 'PARSE_ERROR', errorMsg: null }
      dispatch(setPropertyAndError(id, type, 'value', null, error))
    }
  },
  setPropertyAndError: (id, type, property, value, error) => dispatch(
    setPropertyAndError(id, type, property, value, error)
  ),
  setError: (id, property, error) => dispatch(
    setError(id, property, error)
  )
} )

export default connect(mapStateToProps, mapDispatchToProps)(VariableSlider)

import VariableSlider from './components/VariableSlider'
import { connect } from 'react-redux'
import { setPropertyAndError } from 'containers/MathObjects/actions'
import { setError } from 'services/errors'
import { VARIABLE_SLIDER, setSliderValue } from './actions'
import { getValidateNameAgainst } from '../selectors'
import { parser } from 'constants/parsing'

const mapStateToProps = ( { mathSymbols, sliderValues, parseErrors }, ownProps) => {
  const { id } = ownProps
  return {
    name: mathSymbols[id].name,
    min: mathSymbols[id].min,
    max: mathSymbols[id].max,
    value: sliderValues[id], // number
    valueText: mathSymbols[id].value, // nullable string
    errors: parseErrors[id],
    validateNameAgainst: getValidateNameAgainst(parser, mathSymbols, id)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ( {
  setSliderValue: (value, valueText) => {
    dispatch(setSliderValue(ownProps.id, value))
    if (valueText !== null) {
      const error = { type: 'PARSE_ERROR', errorMsg: null }
      dispatch(setPropertyAndError(ownProps.id, VARIABLE_SLIDER, 'value', null, error))
    }
  },
  setValidatedProperty: (property, value, error) => dispatch(
    setPropertyAndError(ownProps.id, VARIABLE_SLIDER, property, value, error)
  ),
  setError: (property, error) => dispatch(
    setError(ownProps.id, property, error)
  )
} )

export default connect(mapStateToProps, mapDispatchToProps)(VariableSlider)

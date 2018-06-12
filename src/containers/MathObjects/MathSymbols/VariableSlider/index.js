import VariableSlider from './components/VariableSlider'
import { connect } from 'react-redux'
import { setError, setProperty } from 'containers/MathObjects/actions'
import { VARIABLE_SLIDER, setSliderValue } from './actions'
import { getValidateNameAgainst } from '../selectors'
import { parser } from 'constants/parsing'

const mapStateToProps = ( { mathSymbols, sliderValues }, ownProps) => {
  const { id } = ownProps
  return {
    name: mathSymbols[id].name,
    min: mathSymbols[id].min,
    max: mathSymbols[id].max,
    value: sliderValues[id], // number
    valueText: mathSymbols[id].value, // nullable string
    errors: mathSymbols[id].errors,
    validateNameAgainst: getValidateNameAgainst(parser, mathSymbols, id)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onSliderChange: (value, valueText) => {
    dispatch(setSliderValue(ownProps.id, value))
    if (valueText !== null) {
      dispatch(setProperty(ownProps.id, VARIABLE_SLIDER, 'value', null))
    }
  },
  onEditProperty: (property, value) => dispatch(
    setProperty(ownProps.id, VARIABLE_SLIDER, property, value)
  ),
  onErrorChange: (errProp, errMsg) => dispatch(
    setError(ownProps.id, VARIABLE_SLIDER, errProp, errMsg)
  )
} )

export default connect(mapStateToProps, mapDispatchToProps)(VariableSlider)

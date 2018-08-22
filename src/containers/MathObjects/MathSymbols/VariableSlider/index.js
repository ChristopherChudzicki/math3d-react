import VariableSlider from './components/VariableSlider'
import { connect } from 'react-redux'
import { setPropertyAndError } from 'containers/MathObjects/actions'
import { setSliderValue } from './actions'

const mapStateToProps = ( { mathSymbols, sliderValues }, ownProps) => {
  const { id } = ownProps
  return {
    name: mathSymbols[id].name,
    value: sliderValues[id], // number
    valueText: mathSymbols[id].value // nullable string
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
  }
} )

export default connect(mapStateToProps, mapDispatchToProps)(VariableSlider)

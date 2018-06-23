import Variable from './components/Variable'
import { connect } from 'react-redux'
import { setPropertyAndError, setError } from 'containers/MathObjects/actions'
import { VARIABLE } from './actions'
import { getValidateNameAgainst } from '../selectors'
import { parser } from 'constants/parsing'

const mapStateToProps = ( { mathSymbols, parseErrors }, ownProps) => {
  return {
    name: mathSymbols[ownProps.id].name,
    value: mathSymbols[ownProps.id].value,
    errors: parseErrors[ownProps.id],
    validateNameAgainst: getValidateNameAgainst(parser, mathSymbols, ownProps.id)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ( {
  setValidatedProperty: (property, value, error) => dispatch(
    setPropertyAndError(ownProps.id, VARIABLE, property, value, error)
  ),
  setError: (property, error) => dispatch(
    setError(ownProps.id, property, error)
  )
} )

export default connect(mapStateToProps, mapDispatchToProps)(Variable)

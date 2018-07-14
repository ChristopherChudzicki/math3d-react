import Variable from './components/Variable'
import { connect } from 'react-redux'
import { setPropertyAndError } from 'containers/MathObjects/actions'
import { setError } from 'services/errors'
import { getErrors } from 'services/errors/selectors'
import { VARIABLE } from './actions'
import { getValidateNameAgainst } from '../selectors'
import { parser } from 'constants/parsing'

const mapStateToProps = ( { mathSymbols, parseErrors, evalErrors }, ownProps) => {
  const { id } = ownProps
  return {
    name: mathSymbols[id].name,
    value: mathSymbols[id].value,
    errors: getErrors(id, parseErrors, evalErrors),
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

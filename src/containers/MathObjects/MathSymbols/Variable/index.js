import Variable from './components/Variable'
import { connect } from 'react-redux'
import { setError, setProperty } from 'containers/MathObjects/actions'
import { VARIABLE } from './actions'
import { getValidateNameAgainst } from '../selectors'
import { parser } from 'constants/parsing'

const mapStateToProps = ( { mathSymbols }, ownProps) => {
  return {
    name: mathSymbols[ownProps.id].name,
    value: mathSymbols[ownProps.id].value,
    errors: mathSymbols[ownProps.id].errors,
    validateNameAgainst: getValidateNameAgainst(parser, mathSymbols, ownProps.id)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onEditProperty: (property, value) => dispatch(
    setProperty(ownProps.id, VARIABLE, property, value)
  ),
  onErrorChange: (errProp, errMsg) => dispatch(
    setError(ownProps.id, VARIABLE, errProp, errMsg)
  )
} )

export default connect(mapStateToProps, mapDispatchToProps)(Variable)

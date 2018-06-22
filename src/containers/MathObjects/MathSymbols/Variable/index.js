import Variable from './components/Variable'
import { connect } from 'react-redux'
import { setProperty } from 'containers/MathObjects/actions'
import { ERROR } from 'containers/MathObjects/mathObjectTypes'
import { VARIABLE } from './actions'
import { getValidateNameAgainst } from '../selectors'
import { parser } from 'constants/parsing'

const mapStateToProps = ( { mathSymbols, errors }, ownProps) => {
  return {
    name: mathSymbols[ownProps.id].name,
    value: mathSymbols[ownProps.id].value,
    errors: errors[ownProps.id],
    validateNameAgainst: getValidateNameAgainst(parser, mathSymbols, ownProps.id)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onEditProperty: (property, value) => dispatch(
    setProperty(ownProps.id, VARIABLE, property, value)
  ),
  onErrorChange: (errProp, errMsg) => dispatch(
    setProperty(ownProps.id, ERROR, errProp, errMsg)
  )
} )

export default connect(mapStateToProps, mapDispatchToProps)(Variable)

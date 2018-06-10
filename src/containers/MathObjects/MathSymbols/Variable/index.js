import {
  setName,
  setValue
} from './actions'
import Variable from './components/Variable'
import { connect } from 'react-redux'
import { setError } from 'containers/MathObjects/actions'
import { VARIABLE } from 'containers/MathObjects/mathObjectTypes'
import { getNameValidators } from '../selectors'
import { parser } from 'constants/parsing'

const mapStateToProps = ( { mathSymbols }, ownProps) => {
  return {
    name: mathSymbols[ownProps.id].name,
    value: mathSymbols[ownProps.id].value,
    errors: mathSymbols[ownProps.id].errors,
    nameValidators: getNameValidators(parser, mathSymbols, ownProps.id)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onEditName: val => dispatch(setName(ownProps.id, val)),
  onEditValue: val => dispatch(setValue(ownProps.id, val)),
  onErrorChange: (errProp, errMsg) => dispatch(
    setError(ownProps.id, VARIABLE, errProp, errMsg)
  )
} )

export default connect(mapStateToProps, mapDispatchToProps)(Variable)

import {
  setName,
  setValue
} from './actions'
import Variable from './components/Variable'
import { connect } from 'react-redux'

const mapStateToProps = ( { mathSymbols }, ownProps) => ( {
  name: mathSymbols[ownProps.id].name,
  value: mathSymbols[ownProps.id].value
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onEditName: val => dispatch(setName(ownProps.id, val)),
  onEditValue: val => dispatch(setValue(ownProps.id, val))
} )

export default connect(mapStateToProps, mapDispatchToProps)(Variable)

import MathObject from './components/MathObject'
import { connect } from 'react-redux'
import { setActiveObject } from 'containers/MathObjects/services/activeObject/actions'

const mapStateToProps = (state, ownProps) => ( {
  isActive: state.activeObject === ownProps.id
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onFocus: () => dispatch(setActiveObject(ownProps.id)),
  onBlur: () => dispatch(setActiveObject(null))
} )

export default connect(mapStateToProps, mapDispatchToProps)(MathObject)

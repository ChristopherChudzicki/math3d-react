import MathObject from './components/MathObject'
import { connect } from 'react-redux'
import { setActiveObject } from './services/activeObject/actions'
import { setDescription } from './services/descriptions/actions'

const mapStateToProps = (state, ownProps) => ( {
  isActive: state.activeObject === ownProps.id,
  description: state.descriptions[ownProps.id]
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onFocus: () => dispatch(setActiveObject(ownProps.id)),
  onBlur: () => dispatch(setActiveObject(null)),
  onEditDescription: val => dispatch(setDescription(ownProps.id, val))
} )

export default connect(mapStateToProps, mapDispatchToProps)(MathObject)

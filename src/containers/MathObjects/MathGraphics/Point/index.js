import Point from './components/Point'
import { connect } from 'react-redux'
import {
  setCoords,
  toggleVisibility,
  setColor
} from './actions'
import { setError } from 'containers/MathObjects/actions'
import { POINT } from 'containers/MathObjects/mathObjectTypes'

const mapStateToProps = ( { mathGraphics }, ownProps) => ( {
  coords: mathGraphics[ownProps.id].coords,
  color: mathGraphics[ownProps.id].color,
  visible: mathGraphics[ownProps.id].visible,
  errors: mathGraphics[ownProps.id].errors
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onEditCoords: val => dispatch(setCoords(ownProps.id, val)),
  onToggleVisibility: () => dispatch(toggleVisibility(ownProps.id)),
  onSetColor: val => dispatch(setColor(ownProps.id, val)),
  onErrorChange: (errProp, errMsg) => dispatch(
    setError(ownProps.id, POINT, errProp, errMsg)
  )
} )

export default connect(mapStateToProps, mapDispatchToProps)(Point)

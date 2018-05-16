import Point from './components/Point'
import { connect } from 'react-redux'
import {
  setCoords,
  toggleVisibility,
  setColor
} from './actions'

const mapStateToProps = ( { points }, ownProps) => ( {
  coords: points[ownProps.id].coords,
  color: points[ownProps.id].color,
  visible: points[ownProps.id].visible
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onEditCoords: val => dispatch(setCoords(ownProps.id, val)),
  onToggleVisibility: () => dispatch(toggleVisibility(ownProps.id)),
  onSetColor: val => dispatch(setColor(ownProps.id, val))
} )

export default connect(mapStateToProps, mapDispatchToProps)(Point)

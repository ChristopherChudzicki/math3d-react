import Point from './components/Point'
import { connect } from 'react-redux'
import {
  setCoords,
  toggleVisibility,
  setColor
} from './actions'

const mapStateToProps = ( { mathGraphics }, ownProps) => ( {
  coords: mathGraphics[ownProps.id].coords,
  color: mathGraphics[ownProps.id].color,
  visible: mathGraphics[ownProps.id].visible
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onEditCoords: val => dispatch(setCoords(ownProps.id, val)),
  onToggleVisibility: () => dispatch(toggleVisibility(ownProps.id)),
  onSetColor: val => dispatch(setColor(ownProps.id, val))
} )

export default connect(mapStateToProps, mapDispatchToProps)(Point)

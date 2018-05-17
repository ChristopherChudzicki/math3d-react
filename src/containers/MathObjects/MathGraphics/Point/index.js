import Point from './components/Point'
import { connect } from 'react-redux'
import {
  setCoords
} from './actions'

const mapStateToProps = ( { mathGraphics }, ownProps) => ( {
  coords: mathGraphics[ownProps.id].coords
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onEditCoords: val => dispatch(setCoords(ownProps.id, val))
} )

export default connect(mapStateToProps, mapDispatchToProps)(Point)

import Point from './components/Point'
import { connect } from 'react-redux'
import { makeMapDispatchToProps } from '../actions'
import { POINT } from './actions'

const mapStateToProps = ( { mathGraphics }, ownProps) => ( {
  coords: mathGraphics[ownProps.id].coords,
  color: mathGraphics[ownProps.id].color,
  visible: mathGraphics[ownProps.id].visible,
  errors: mathGraphics[ownProps.id].errors
} )

const mapDispatchToProps = makeMapDispatchToProps(POINT)

export default connect(mapStateToProps, mapDispatchToProps)(Point)

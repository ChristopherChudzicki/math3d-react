import Point from './components/Point'
import { connect } from 'react-redux'
import {
  setPointDescription
} from './actions'

const mapStateToProps = ( { points }, ownProps) => ( {
  description: points[ownProps.id].description
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onEditDescription: (value) => dispatch(setPointDescription(ownProps.id, value))
} )

export default connect(mapStateToProps, mapDispatchToProps)(Point)

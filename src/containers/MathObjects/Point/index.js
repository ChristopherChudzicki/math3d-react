import Point from './components/Point'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => ( {
  description: state.points[ownProps.id].description
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
} )

export default connect(mapStateToProps, mapDispatchToProps)(Point)

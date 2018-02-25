import Drawer from './Drawer'
import { connect } from 'react-redux'
import { setVisibility } from './actions'

const mapStateToProps = ( { drawers }, ownProps) => ( {
  isVisible: drawers[ownProps.id]
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onOpen: () => dispatch(setVisibility(ownProps.id, true)),
  onClose: () => dispatch(setVisibility(ownProps.id, false))
} )

export default connect(mapStateToProps, mapDispatchToProps)(Drawer)

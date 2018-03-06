import Drawer from './components/Drawer'
import { connect } from 'react-redux'
import { openDrawer, closeDrawer } from './actions'

// This is the default animation speed set by components/Drawer
const animationSpeed = 1000

const mapStateToProps = ( { drawers }, ownProps) => ( {
  isOpen: drawers[ownProps.id].isVisible,
  isAnimating: drawers[ownProps.id].isAnimating
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onOpen: () => dispatch(openDrawer(ownProps.id, animationSpeed)),
  onClose: () => dispatch(closeDrawer(ownProps.id, animationSpeed))
} )

export default connect(mapStateToProps, mapDispatchToProps)(Drawer)

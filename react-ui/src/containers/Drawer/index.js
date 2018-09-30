import Drawer from './components/Drawer'
import { connect } from 'react-redux'
import { openDrawer, closeDrawer } from './actions'

const mapStateToProps = ( { drawers }, ownProps) => ( {
  isOpen: drawers[ownProps.id].isVisible,
  isAnimating: drawers[ownProps.id].isAnimating
} )

const mapDispatchToProps = {
  onOpen: openDrawer,
  onClose: closeDrawer
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer)

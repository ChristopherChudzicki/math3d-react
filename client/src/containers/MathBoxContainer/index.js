import { connect } from 'react-redux'
import MathBoxContainer from './components/MathBoxContainer'

function getLeftAnimationStatus(state) {
  return state.drawers.main.isAnimating
}

function getLeftOffset(state) {
  const width = 400
  const { isVisible } = state.drawers.main
  return isVisible ? `${-width / 2}px` : '0px'
}

const mapStateToProps = (state, ownProps) => ( {
  leftOffset: getLeftOffset(state),
  isAnimating: getLeftAnimationStatus(state)
} )

export default connect(mapStateToProps)(MathBoxContainer)

import MathGraphic from './components/MathGraphic'
import { connect } from 'react-redux'
import {
  toggleProperty,
  setProperty
} from 'containers/MathObjects/actions'

const mapStateToProps = ( { mathGraphics, parseErrors, evalErrors }, ownProps) => {
  const { id } = ownProps
  return {
    color: mathGraphics[id].color,
    visible: mathGraphics[id].visible
  }
}

const mapDispatchToProps = {
  toggleProperty,
  setProperty
}

export default connect(mapStateToProps, mapDispatchToProps)(MathGraphic)

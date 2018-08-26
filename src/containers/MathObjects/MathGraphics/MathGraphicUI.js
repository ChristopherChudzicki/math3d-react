import MathGraphicUI from './components/MathGraphicUI'
import { connect } from 'react-redux'
import {
  toggleProperty,
  setProperty
} from 'containers/MathObjects/actions'

const mapStateToProps = ( { activeObject, mathGraphics, parseErrors, evalErrors }, ownProps) => {
  const { id } = ownProps
  return {
    color: mathGraphics[id].color,
    visible: mathGraphics[id].visible,
    isActive: activeObject === id
  }
}

const mapDispatchToProps = {
  toggleProperty,
  setProperty
}

export default connect(mapStateToProps, mapDispatchToProps)(MathGraphicUI)

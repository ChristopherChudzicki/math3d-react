import MathGraphicUI from './components/MathGraphicUI'
import { connect } from 'react-redux'
import {
  toggleProperty,
  setProperty
} from '../../../../../containers/MathObjects/actions'

const mapStateToProps = ( { activeObject, mathGraphics, parseErrors, evalErrors }, ownProps) => {
  const { id } = ownProps
  return {
    color: mathGraphics[id].color, // I do not think this is used, since EvalautedStatusSymbol is connected
    visible: mathGraphics[id].visible, // I do not think this is used, since EvalautedStatusSymbol is connected
    isActive: activeObject === id
  }
}

const mapDispatchToProps = {
  toggleProperty,
  setProperty
}

export default connect(mapStateToProps, mapDispatchToProps)(MathGraphicUI)

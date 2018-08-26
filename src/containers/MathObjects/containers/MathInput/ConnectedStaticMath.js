// @flow
import { connect } from 'react-redux'
import { StaticMathStyled } from './components/MathQuillStyled'
import { getMathObjectProp } from './selectors'

const mapStateToProps = ( { mathSymbols, mathGraphics }, ownProps) => {
  const { parentId, field } = ownProps
  return {
    latex: getMathObjectProp( [mathGraphics, mathSymbols], parentId, field)
  }
}

export default connect(mapStateToProps)(StaticMathStyled)

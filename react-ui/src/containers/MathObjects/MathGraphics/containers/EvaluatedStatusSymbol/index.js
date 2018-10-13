// @flow
import EvaluatedStatusSymbol from './components/EvaluatedStatusSymbol'
import {
  toggleProperty,
  setProperty
} from 'containers/MathObjects/actions'

// For connecting
import { connect } from 'react-redux'

const mapStateToProps = ( { mathGraphics }, ownProps) => {
  const { id } = ownProps
  const {
    color,
    visible,
    useCalculatedVisibility,
    calculatedVisibility,
    type
  } = mathGraphics[id]
  return {
    color,
    visible,
    useCalculatedVisibility,
    calculatedVisibility,
    type
  }
}

const mapDispatchToProps = {
  toggleProperty,
  setProperty
}

export default connect(mapStateToProps, mapDispatchToProps)(EvaluatedStatusSymbol)

import { MathScopeProvider } from './components/MathScopeContext'
import { connect } from 'react-redux'
import { getParseableSymbols } from './selectors'
import { setError } from 'services/errors'
export { MathScopeConsumer } from './components/MathScopeContext'

// TODO: This updates when it does not need to because of parseErrors
const mapStateToProps = ( { mathSymbols, sliderValues }, ownProps) => {
  const { symbols, idsByName } = getParseableSymbols(ownProps.parser, mathSymbols, sliderValues)
  const evaluationResult = ownProps.scopeEvaluator.evalScope(symbols)
  window.evaluationResult = evaluationResult
  return {
    idsByName,
    ...evaluationResult
  }
}

const mapDispatchToProps = { setError }

export default connect(mapStateToProps, mapDispatchToProps)(MathScopeProvider)

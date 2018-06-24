import { MathScopeProvider } from './components/MathScopeContext'
import { connect } from 'react-redux'
import { getSafeMathSymbols } from './selectors'

const mapStateToProps = ( { mathSymbols, parseErrors }, ownProps) => {
  const safeMathSymbols = getSafeMathSymbols(mathSymbols, parseErrors)
  console.log(safeMathSymbols)
  return {
    evaluationResult: {
      scope: {},
      errors: {},
      updated: new Set()
    }
  }
}

export default connect(mapStateToProps)(MathScopeProvider)

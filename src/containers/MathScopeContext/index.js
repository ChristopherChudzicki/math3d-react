import { MathScopeProvider } from './components/MathScopeContext'
import { connect } from 'react-redux'
import { getSafeMathSymbols } from './selectors'

const mapStateToProps = ( { mathSymbols, errors }, ownProps) => {
  const safeMathSymbols = getSafeMathSymbols(mathSymbols, errors)
  return {
    evaluationResult: {
      scope: {},
      errors: {},
      updated: new Set()
    }
  }
}

export default connect(mapStateToProps)(MathScopeProvider)

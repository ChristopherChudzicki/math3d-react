import { Component } from 'react'
import PropTypes from 'prop-types'
import { ScopeEvaluator, Parser } from 'utils/mathParsing'

export default class CalculationResult extends Component {

  static propTypes = {
    parser: PropTypes.instanceOf(Parser).isRequired,
    scopeEvaluator: PropTypes.instanceOf(ScopeEvaluator).isRequired,
    symbols: PropTypes.objectOf(PropTypes.string).isRequired,
    onSymbolError: PropTypes.func.isRequired,
    toCalculate: PropTypes.objectOf(PropTypes.string).isRequired,
    onCalcError: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  }

  calculate() {
    const {
      parser,
      scopeEvaluator,
      symbols,
      toCalculate
    } = this.props
    const { scope } = scopeEvaluator.evalScope(symbols)
    return Object.keys(toCalculate).reduce((result, key) => {
      result[key] = parser.parse(toCalculate[key] ).eval(scope)
      return result
    }, { } )
  }

  render() {
    const calculated = this.calculate()
    return this.props.children(calculated)
  }

}

import { Component } from 'react'
import PropTypes from 'prop-types'
import { ScopeEvaluator, Parser } from 'utils/mathParsing'

// TODO: !!!Definitely do this.
// With the current setup, each individual CalculationResult component will be
// dispatching evaluation errors.
//
// Maybe it would be better to have two components:
//
// ScopeEvaluator: evaluates the scope and dispatches errors
// ExpressionCalculator: takes a scope and evaluates expressions
//
// This seems like a good idea ...
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

import { Component } from 'react'
import PropTypes from 'prop-types'
import { Parser } from 'utils/mathParsing'

export default class EvaluationResult extends Component {

  static propTypes = {
    parser: PropTypes.instanceOf(Parser).isRequired,
    scope: PropTypes.object.isRequired,
    toEvaluate: PropTypes.objectOf(PropTypes.string).isRequired,
    onEvalError: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.result = this.evaluate()
  }

  evaluate() {
    const {
      parser,
      scope,
      toEvaluate
    } = this.props
    return Object.keys(toEvaluate).reduce(
      (result, key) => {
        result[key] = parser.parse(toEvaluate[key] ).eval(scope)
        return result
      }, { } )
  }

  render() {
    const result = this.evaluate(this.props.toEvaluate)
    return this.props.children(result)
  }

}

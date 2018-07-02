import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ScopeEvaluator } from 'utils/mathParsing'
import { EVAL_ERROR } from 'services/errors'

const MathScopeContext = React.createContext()

export class MathScopeProvider extends PureComponent {

  static propTypes = {
    scopeEvaluator: PropTypes.instanceOf(ScopeEvaluator).isRequired,
    idsByName: PropTypes.objectOf(PropTypes.string).isRequired,
    scope: PropTypes.object.isRequired,
    updated: PropTypes.instanceOf(Set).isRequired,
    errors: PropTypes.object.isRequired,
    children: PropTypes.oneOfType( [
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ] ).isRequired,
    setError: PropTypes.func.isRequired
  }

  componentDidUpdate() {
    const { errors, idsByName, setError } = this.props
    Object.keys(errors).map(name => {
      setError(idsByName[name], 'value', {
        errorType: EVAL_ERROR,
        errorMsg: errors[name].message
      } )
    } )
  }

  render() {
    const { scope, updated } = this.props
    return (
      <MathScopeContext.Provider
        value={{ scope, updated }}
      >
        {this.props.children}
      </MathScopeContext.Provider>
    )
  }

}

export const MathScopeConsumer = MathScopeContext.Consumer

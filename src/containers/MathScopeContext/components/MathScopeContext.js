import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ScopeEvaluator } from 'utils/mathParsing'

const MathScopeContext = React.createContext()

export class MathScopeProvider extends PureComponent {

  static propTypes = {
    scopeEvaluator: PropTypes.instanceOf(ScopeEvaluator).isRequired,
    evaluationResult: PropTypes.shape( {
      scope: PropTypes.object.isRequired,
      updated: PropTypes.instanceOf(Set).isRequired,
      errors: PropTypes.object.isRequired
    } ).isRequired,
    children: PropTypes.oneOfType( [
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ] ).isRequired
  }

  componentDidUpdate(prevProps) {
  }

  render() {
    const { evaluationResult } = this.props
    return (
      <MathScopeContext.Provider
        value={{
          scope: evaluationResult.scope,
          updated: evaluationResult.updated
        }}
      >
        {this.props.children}
      </MathScopeContext.Provider>
    )
  }

}

export const MathScopeConsumer = MathScopeContext.Consumer

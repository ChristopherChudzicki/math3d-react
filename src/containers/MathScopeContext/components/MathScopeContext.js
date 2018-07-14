import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ScopeEvaluator, Parser } from 'utils/mathParsing'
import { EVAL_ERROR } from 'services/errors'

const MathScopeContext = React.createContext()

export class MathScopeProvider extends PureComponent {

  static propTypes = {
    parser: PropTypes.instanceOf(Parser).isRequired,
    scopeEvaluator: PropTypes.instanceOf(ScopeEvaluator).isRequired,
    idsByName: PropTypes.objectOf(PropTypes.string).isRequired,
    scope: PropTypes.object.isRequired,
    scopeDiff: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    errorsDiff: PropTypes.object.isRequired,
    children: PropTypes.oneOfType( [
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ] ).isRequired,
    setError: PropTypes.func.isRequired
  }

  componentDidUpdate(prevProps) {
    const { errors, idsByName, setError, errorsDiff } = this.props

    const errorsToDispatch = [...errorsDiff.added, ...errorsDiff.updated]
    errorsToDispatch.map(name => {
      setError(idsByName[name], 'value', {
        errorType: EVAL_ERROR,
        errorMsg: errors[name].message
      } )
    } )

    // delete old errors if no longer present
    // Need to use previous idsByName prop in case the variable got deleted!
    const prevIdsByName = prevProps.idsByName
    errorsDiff.deleted.map(name => {
      setError(prevIdsByName[name], 'value', {
        errorType: EVAL_ERROR
      } )
    } )

  }

  render() {
    const { scope, scopeDiff } = this.props
    return (
      <MathScopeContext.Provider
        value={{ scope, scopeDiff }}
      >
        {this.props.children}
      </MathScopeContext.Provider>
    )
  }

}

export const MathScopeConsumer = MathScopeContext.Consumer

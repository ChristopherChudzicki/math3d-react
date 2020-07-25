import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ScopeEvaluator, Parser } from 'utils/mathParsing'
import { EvalErrorData } from 'services/errors'

const MathScopeContext = React.createContext()

export class MathScopeProvider extends PureComponent {

  static propTypes = {
    parser: PropTypes.instanceOf(Parser).isRequired,
    scopeEvaluator: PropTypes.instanceOf(ScopeEvaluator).isRequired,
    idsByName: PropTypes.objectOf(PropTypes.string).isRequired,
    allSymbolIds: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    const { errors, idsByName, setError, errorsDiff, allSymbolIds } = this.props
    const symbolIds = new Set(allSymbolIds);
    // delete old errors if no longer present
    // Need to use previous idsByName prop in case
    // the variable got deleted or its name has changed
    // Note: if name changed, we might be re-adding the error below
    // Note: idsByName only includes uniquely named symbol ids.
    const prevIdsByName = prevProps.idsByName
    errorsDiff.deleted
      .filter(name => {
        // check that the symbol still exists; if it was deleted, we do not need to unset the error
        return symbolIds.has(prevIdsByName[name])
      })
      .forEach(name => {
        const errorData = new EvalErrorData(null)
        setError(prevIdsByName[name], 'value', errorData)
      } )

    // add in the new errors
    const errorsToDispatch = [...errorsDiff.added, ...errorsDiff.updated]
    errorsToDispatch.forEach(name => {
      const errorData = new EvalErrorData(errors[name].message)
      setError(idsByName[name], 'value', errorData)
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

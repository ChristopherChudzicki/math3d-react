import {
  toggleProperty,
  setProperty,
  setPropertyAndError
} from 'containers/MathObjects/actions'
import { setError } from 'services/errors'

export function makeMapDispatchToProps(type) {
  return (dispatch, ownProps) => {
    const { id } = ownProps
    return {
      toggleVisibility: () => dispatch(
        toggleProperty(id, type, 'visible')
      ),
      setColor: value => dispatch(
        setProperty(id, type, 'color', value)
      ),
      setProperty: (property, value) => dispatch(
        setProperty(id, type, property, value)
      ),
      setValidatedProperty: (property, value, error) => dispatch(
        setPropertyAndError(id, type, property, value, error)
      ),
      setError: (property, error) => dispatch(
        setError(id, property, error)
      )
    }
  }
}

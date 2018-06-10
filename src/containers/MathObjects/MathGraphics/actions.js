import {
  toggleProperty,
  setProperty,
  setError
} from 'containers/MathObjects/actions'

export function makeMapDispatchToProps(type) {
  return (dispatch, ownProps) => {
    const { id } = ownProps
    return {
      onToggleVisibility: () => dispatch(
        toggleProperty(id, type, 'visible')
      ),
      onSetColor: val => dispatch(
        value => setProperty(id, type, 'color', value)
      ),
      onEditProperty: (property, value) => dispatch(
        setProperty(id, type, property, value)
      ),
      onErrorChange: (errProp, errMsg) => dispatch(
        setError(id, type, errProp, errMsg)
      )
    }
  }
}

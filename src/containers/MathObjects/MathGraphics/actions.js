import {
  toggleProperty,
  setProperty
} from 'containers/MathObjects/actions'
import { ERROR } from 'containers/MathObjects/mathObjectTypes'

export function makeMapDispatchToProps(type) {
  return (dispatch, ownProps) => {
    const { id } = ownProps
    return {
      onToggleVisibility: () => dispatch(
        toggleProperty(id, type, 'visible')
      ),
      onSetColor: value => dispatch(
        setProperty(id, type, 'color', value)
      ),
      onEditProperty: (property, value) => dispatch(
        setProperty(id, type, property, value)
      ),
      onErrorChange: (errProp, errMsg) => dispatch(
        setProperty(id, ERROR, errProp, errMsg)
      )
    }
  }
}

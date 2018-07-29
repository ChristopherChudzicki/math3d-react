import {
  toggleProperty,
  setProperty,
  setPropertyAndError
} from 'containers/MathObjects/actions'
import { setError } from 'services/errors'

export const mapDispatchToProps = {
  toggleProperty,
  setPropertyAndError,
  setError,
  setProperty
}

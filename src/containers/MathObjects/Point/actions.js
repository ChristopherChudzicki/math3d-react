import {
  // toggleProperty,
  setProperty
} from 'containers/MathObjects/actions'

export const POINT = 'POINT'

export const setPointDescription = (id, value) => {
  return setProperty(id, POINT, 'description', value)
}

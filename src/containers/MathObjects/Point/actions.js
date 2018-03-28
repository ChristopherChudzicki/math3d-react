import {
  // toggleProperty,
  setProperty
} from 'containers/MathObjects/actions'

export const POINT = 'POINT'

export const setCoords = (id, value) => {
  return setProperty(id, POINT, 'coords', value)
}

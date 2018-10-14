// @flow
import customMath from './custom'
import { diff, unitT, unitN, unitB } from './derivatives'

const imaginaryUnit = customMath.i
customMath.import( {
  diff,
  unitT,
  unitN,
  unitB,
  i: [1, 0, 0],
  j: [0, 1, 0],
  k: [0, 0, 1],
  I: imaginaryUnit
}, { override: true } )

export default customMath

window.math = customMath

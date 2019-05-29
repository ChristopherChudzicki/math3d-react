// @flow
import customMath from './custom'
import { diff, unitT, unitN, unitB } from './derivatives'

function arctan(arg0: number, arg1?: number) {
  return arg1 === undefined ? customMath.atan(arg0) : customMath.atan2(arg0, arg1)
}

const imaginaryUnit = customMath.i
customMath.import( {
  diff,
  unitT,
  unitN,
  unitB,
  i: [1, 0, 0],
  j: [0, 1, 0],
  k: [0, 0, 1],
  I: imaginaryUnit,
  arcsin: customMath.asin,
  arccos: customMath.acos,
  arctan: arctan
}, { override: true } )

export default customMath

window.math = customMath

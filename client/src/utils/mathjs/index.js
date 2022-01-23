// @flow
import customMath from './custom'
import { diff, pdiff, unitT, unitN, unitB, curl, div } from './derivatives'
import { int } from './integral'
import Integrator from './Integrator'

function arctan(arg0: number, arg1?: number) {
  return arg1 === undefined ? customMath.atan(arg0) : customMath.atan2(arg0, arg1)
}

const imaginaryUnit = customMath.i
customMath.import( {
  int,
  diff,
  pdiff,
  unitT,
  unitN,
  unitB,
  div,
  curl,
  i: [1, 0, 0],
  j: [0, 1, 0],
  k: [0, 0, 1],
  I: imaginaryUnit,
  arcsin: customMath.asin,
  arccos: customMath.acos,
  arctan: arctan,
  arcsinh: customMath.asinh,
  arccosh: customMath.acosh,
  arctanh: customMath.atanh
}, { override: true } )

export default customMath

window.math = customMath

export const integrator = new Integrator()
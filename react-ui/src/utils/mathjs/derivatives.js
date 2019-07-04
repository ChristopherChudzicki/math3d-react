// @flow
import type { Numeric } from './types'
import math from './custom'

type NumericFunction = (...args: Array<Numeric>) => Numeric

const EPS = 0.0008
const EPS2 = EPS/2

export const diff = (f: NumericFunction, ...values: [] | Array<Numeric>) => {

  const derivative = (...args: Array<Numeric>): Numeric => {
    const derivComponents = args.map((arg, j) => {
      args[j] = math.add(arg, -EPS2)
      const initialValue = f(...args)
      args[j] = math.add(arg, +EPS2)
      const finalValue = f(...args)
      args[j] = arg
      return math.divide(math.subtract(finalValue, initialValue), EPS)
    } )
    return derivComponents.length === 1
      ? derivComponents[0]
      : derivComponents
  }
  Object.defineProperty(derivative, 'length', { value: f.length } )

  // $FlowFixMe
  return values.length === 0
    ? derivative
    : derivative(...values)
}

type Func1to3 = (t: number) => [number, number, number]

export const unitT = (f: Func1to3, t: number) => {
  // $FlowFixMe ... need to make add/subtract polymorhpic & length-preserving
  const tangent = math.subtract(f(t + EPS2), f(t - EPS2))
  return math.divide(tangent, math.norm(tangent))
}
export const unitN = (f: Func1to3, t: number) => {
  const normal = math.subtract(unitT(f, t + EPS2), unitT(f, t - EPS2))
  return math.divide(normal, math.norm(normal))
}
export const unitB = (f: Func1to3, t: number) => {
  return math.cross(unitT(f, t), unitN(f, t))
}

export const curl = (f: NumericFunction, x: number, y: number, z: number) => {
  const [dxf, dyf, dzf] = diff(f, x, y, z)
  // $FlowFixMe flow has trouble recognizing that diff() returned a 3 x 3 matrix
  return [ dyf[2] - dzf[1], dzf[0] - dxf[2], dxf[1] - dyf[0] ]
}

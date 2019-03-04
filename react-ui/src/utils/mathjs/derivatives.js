// @flow
import type { Numeric } from './types'
import math from './custom'

type NumericFunction = (...args: Array<Numeric>) => Numeric

const EPS = 0.0008

export const diff = (f: NumericFunction, ...values: [] | Array<Numeric>) => {

  const derivative = (...args: Array<Numeric>): Numeric => {
    const derivComponents = args.map((arg, j) => {
      args[j] = math.add(arg, -0.5*EPS)
      const initialValue = f(...args)
      args[j] = math.add(arg, +0.5*EPS)
      const finalValue = f(...args)
      args[j] = arg
      return math.divide(math.subtract(finalValue, initialValue), EPS)
    } )
    return derivComponents.length === 1
      ? derivComponents[0]
      : derivComponents
  }
  Object.defineProperty(derivative, 'length', { value: f.length } )

  return values.length === 0
    ? derivative
    : derivative(...values)
}

type Func3to1 = (t: number) => [number, number, number]
export const unitT = (f: Func3to1, t: number) => {
  // $FlowFixMe ... need to make add/subtract polymorhpic & length-preserving
  const tangent = math.subtract(f(t + EPS/2), f(t - EPS/2))
  return math.divide(tangent, math.norm(tangent))
}
export const unitN = (f: Func3to1, t: number) => {
  const normal = math.subtract(unitT(f, t + EPS/2), unitT(f, t - EPS/2))
  return math.divide(normal, math.norm(normal))
}
export const unitB = (f: Func3to1, t: number) => {
  return math.cross(unitT(f, t), unitN(f, t))
}

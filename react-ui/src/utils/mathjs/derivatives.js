// @flow
import type { Numeric } from './types'
import math from './custom'

type NumericFunction = (...args: Array<Numeric>) => Numeric

export const diff = (f: NumericFunction, ...values: []|Array<Numeric>) => {
  const eps = 0.0008
  const derivative = (...args: Array<Numeric>): Numeric => {
    const derivComponents = args.map((arg, j) => {
      args[j] = math.add(arg, -0.5*eps)
      const initialValue = f(...args)
      args[j] = math.add(arg, +0.5*eps)
      const finalValue = f(...args)
      args[j] = arg
      return math.divide(math.subtract(finalValue, initialValue), eps)
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

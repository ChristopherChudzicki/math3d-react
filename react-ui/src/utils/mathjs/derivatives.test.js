import { diff, unitT, unitN, unitB, curl } from './derivatives'
import math from './custom'
import { toNearlyEqual } from 'utils/testing/matchers'

// For comparing approximate equality of arrays, functions, objects.
// For numbers, this uses a default tolerance of 1e-4
expect.extend( {
  toNearlyEqual: (received, expected) => toNearlyEqual(received, expected, { numDigits: 4 } )
} )

describe('diff', () => {

  it('differentiates js-defined functions R^1 => R^1', () => {
    const f = x => x**3 + x + 2
    const manualDf = x => 3*x**2 + 1

    // If given a function, diff returns a function:
    const df = diff(f)
    expect(typeof df).toBe('function')
    expect(df).toHaveLength(1)
    expect(df).toNearlyEqual(manualDf)

    // If given a function and values, diff evaluates:
    const evalDf = (x) => diff(f, x)
    expect(evalDf).toNearlyEqual(manualDf)
  } )

  it('differentiates mathjs-defined functions R^1 => R^1', () => {
    // Note: There was a weird note in original math3d about arguments in mathjs
    // sometimes being strings. I don't think that actually happens; this test
    // is meant to try and bring that behavior out.
    const f = math.eval('f(x) = x^3 +x + 2')
    const df = x => math.eval('diff(f, x)', { f, diff, x } )
    const manualDf = x => 3*x**2 + 1

    expect(df).toNearlyEqual(manualDf)
  } )

  it('differentiates js-defined functions R^3 => R^1', () => {
    const f = (x, y, z) => y*x**3 + x*y*z**2 + 2*x**2 + y**2 + z**2
    const manualDf = (x, y, z) => [
      3*y*x**2 + y*z**2 + 4*x,
      x**3 + x*z**2 + 2*y,
      2*x*y*z + 2*z
    ]

    // If given a function, diff returns a function:
    const df = diff(f)
    expect(typeof df).toBe('function')
    expect(df).toHaveLength(3)
    expect(df).toNearlyEqual(manualDf)

    // If given a function and values, diff evaluates:
    const evalDf = (x, y, z) => diff(f, x, y, z)
    expect(evalDf).toNearlyEqual(manualDf)
  } )

  it('differentiates js-defined functions R^2 => R^3', () => {
    const f = (u, v) => [u**2 * v, u*v**3, u**2 + u*v]
    const manualDf = (u, v) => [
      [2*u*v, v**3, 2*u + v],
      [u**2, 3*u*v**2, u]
    ]

    // If given a function, diff returns a function:
    const df = diff(f)
    expect(typeof df).toBe('function')
    expect(df).toHaveLength(2)
    expect(df).toNearlyEqual(manualDf)

    // If given a function and values, diff evaluates:
    const evalDf = (u, v) => diff(f, u, v)
    expect(evalDf).toNearlyEqual(manualDf)
  } )

} )

describe('unitT', () => {
  it('is correct in special case', () => {
    const f = t => [t, (2/3)*t**3, t**2]
    const manualUnitT = t => [
      1/(1 + 2*t**2),
      (2*t**2)/(1 + 2*t**2),
      (2*t)/(1 + 2*t**2)
    ]
    expect(t => unitT(f, t)).toNearlyEqual(manualUnitT)
  } )
} )

describe('unitN', () => {
  it('is correct in special case', () => {
    const f = t => [t, (2/3)*t**3, t**2]
    const manualUnitN = t => [
      -((2*t)/(1 + 2*t**2)),
      (2*t)/(1 + 2*t**2),
      -1 + 2/(1 + 2*t**2)
    ]
    expect(t => unitN(f, t)).toNearlyEqual(manualUnitN)
  } )
} )

describe('unitB', () => {
  it('is correct in special case', () => {
    const f = t => [t, (2/3)*t**3, t**2]
    const manualUnitB = t => [
      -1 + 1/(1 + 2*t**2),
      1/(-1 - 2*t**2),
      (2*t)/(1 + 2*t**2)
    ]
    expect(t => unitB(f, t)).toNearlyEqual(manualUnitB)

  } )
} )

describe('curl', () => {
  it('is correct in special case', () => {
    const f = (x, y, z) => [x*y*z, x**2*y**2*z**2, x**3*y**3*z**3]
    const manualCurl = (x, y, z) => [
      -2*x**2*y**2*z + 3*x**3*y**2*z**3,
      x*y - 3*x**2*y**3*z**3,
      -x*z + 2*x*y**2*z**2
    ]
    const calcCurl = (x, y, z) => curl(f, x, y, z)
    expect(calcCurl).toNearlyEqual(manualCurl)

  } )
} )

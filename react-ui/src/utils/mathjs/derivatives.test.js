import { diff } from './derivatives'
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
    expect(df(3.7)).toNearlyEqual(manualDf(3.7))

    // If given a function and values, diff evaluates:
    expect(diff(f, 3.7)).toNearlyEqual(manualDf(3.7))
  } )

  it('differentiates mathjs-defined functions R^1 => R^1', () => {
    // Note: There was a weird note in original math3d about arguments in mathjs
    // sometimes being strings. I don't think that actually happens; this test
    // is meant to try and bring that behavior out.
    const f = math.eval('f(x) = x^3 +x + 2')
    const manualDf = x => 3*x**2 + 1

    expect(math.eval('diff(f, 3.7)', { f, diff } ))
      .toNearlyEqual(manualDf(3.7))
  } )

} )

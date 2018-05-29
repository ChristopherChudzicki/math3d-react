import {
  isNearlyEqual,
  toNearlyEqual
} from './matchers'

expect.extend( {
  toNearlyEqual
} )

describe('isNearlyEqual', () => {
  const tol = 1e-6

  test('inputs with different types fail', () => {
    expect(isNearlyEqual(5, 'cat')).toBe(false)
  } )

  test('numbers pass/fail based on threshold', () => {
    const a = 5
    const b = a + 0.5 * tol
    const c = a + 2 * tol

    expect(isNearlyEqual(a, b)).toBe(true)
    expect(isNearlyEqual(a, c)).toBe(false)
    expect(isNearlyEqual(1, 1.09, { numDigits: 1 } )).toBe(true)
  } )

  test('arrays of equal length pass/fail based on threshold', () => {
    const a = [4, 12, -8]
    const b = [ a[0], a[1] + tol, a[2] ]
    const c = [ a[0], a[1] + tol, a[2] - 2 * tol ]
    expect(isNearlyEqual(a, b)).toBe(true)
    expect(isNearlyEqual(a, c)).toBe(false)
  } )

  test('inputs of unequal length fail', () => {
    const a = [1, 2]
    const b = [3, 4, 5]
    expect(isNearlyEqual(a, b)).toBe(false)
  } )

  test('functions with arity 1 pass/fail based on math equivalence', () => {
    const f = jest.fn(x => x**2 - x - 6)
    const g = jest.fn(x => (x - 3) * (x + 2))
    const h = jest.fn(x => 5)

    expect(isNearlyEqual(f, g, { nSamples: 4 } )).toBe(true)
    expect(f).toHaveBeenCalledTimes(4)
    expect(g).toHaveBeenCalledTimes(4)
    expect(isNearlyEqual(f, h, { nSamples: 5 } )).toBe(false)
    expect(f).toHaveBeenCalledTimes(9)
    expect(h).toHaveBeenCalledTimes(5)
  } )

  test('functions with arity 2 pass/fail based on math equivalence', () => {
    const f = jest.fn((x, y) => x**2 + 2*x*y + y**2)
    const g = jest.fn((x, y) => (x + y)**2)
    const h = jest.fn((x, y) => x + y)

    expect(isNearlyEqual(f, g, { nSamples: 4 } )).toBe(true)
    expect(isNearlyEqual(f, h, { nSamples: 5 } )).toBe(false)
  } )

  test('Functions with nominally different arity can be nearly equal', () => {
    // Whether this is a good idea is probably debatable.
    const f = x => 5
    const g = (x, y) => 5
    expect(isNearlyEqual(f, g)).toBe(true)
  } )

  test('nearly equal objects pass', () => {
    const a = {
      a: 18,
      b: [2, 8, -4],
      c: [x => x**2 + 1, 4]
    }
    const b = {
      a: 18 - 0.5 * tol,
      b: [2 + 0.2 * tol, 8, -4 - 0.5 * tol],
      c: [x => x*x + 1, 4 + 0.3*tol]
    }

    expect(isNearlyEqual(a, b)).toBe(true)
  } )

  test('order of keys in object does not matter', () => {
    const a = {
      x: 4,
      y: 3
    }
    const b = {
      y: 3 - 0.5*tol,
      x: 4 + 0.1*tol
    }

    expect(isNearlyEqual(a, b)).toBe(true)

  } )

  test('objects with differing number of keys fail', () => {
    const a = { x: 0, y: 1, z: [1, 2, 3] }
    const b = { x: 0, z: [1, 2, 3] }
    expect(isNearlyEqual(a, b)).toBe(false)
    expect(isNearlyEqual(b, a)).toBe(false)
  } )

} )

describe('toNearlyEqual', () => {
  test('rejects objects that are not nearly equal', () => {
    const received = {
      a: 5,
      f: t => 2 * Math.cos(t) * Math.sin(t),
      x: [2, 4, 8, 16]
    }
    const expected = {
      a: 5,
      f: t => Math.sin(2 * t) + 1,
      x: [2, 4, 8, 16]
    }

    expect(received).not.toNearlyEqual(expected)

  } )
} )

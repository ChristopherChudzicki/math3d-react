import {
  genMathScope,
  getEvalOrder,
  getChildMap,
  getDescendants,
  deserializeFunction
}
  from './mathscope'
import ParserCache from './ParserCache'

const DIGITS = 6

describe('deserializing mathscope', () => {

  test('scope created correctly when no errors present', () => {
    // scope
    // a = b/2 - c
    // f(x, y) = a * x^2 - b * y
    // b = g(4)
    // g(t) = t^(2+d) + c
    // c = - 1
    // d = 1

    const expectedScope = {
      a: 14,
      b: 26,
      c: -1,
      d: 1,
      f: (x, y) => 14 * (x ** 2) - 26 * y,
      g: t => t ** 3 - 1
    }

    const symbols = {
      a: {
        expression: '\\frac{b}{2}-c',
        arguments: null
      },
      f: {
        arguments: ['x', 'y'],
        expression: 'a\\cdot x^2-b\\cdot y'
      },
      b: {
        expression: 'g\\left(4\\right)',
        arguments: null
      },
      g: {
        arguments: ['t'],
        expression: 't^{2+d}+c'
      },
      c: {
        expression: '-1',
        arguments: null
      },
      d: {
        expression: '1',
        arguments: null
      }
    }

    const parserCache = new ParserCache()
    const mathScope = genMathScope(symbols, parserCache)

    // expect(mathScope.a).toBeCloseTo(expectedScope.a, DIGITS)
    // expect(mathScope.b).toBeCloseTo(expectedScope.b, DIGITS)
    // expect(mathScope.c).toBeCloseTo(expectedScope.c, DIGITS)
    // expect(mathScope.d).toBeCloseTo(expectedScope.d, DIGITS)
  } )

} )

describe('generating evaluation order', () => {

  /*
  *     a = b/2 - c
  *     a2 = a^2
  *     b = h(4) + c
  *     c = -1
  *     d = +1
  *     f(x, y) = a*x^2 - b*y
  *     h(t) = t^2 -1
  *     p = c^2 + d^2
  *
  * Graph:
  *
  * d ----------->--- p
  *          /           --->-- a2
  * c -->-------\       /
  *        \     -->-- a -->--- f
  * h -->-- b --/              /
  *         \                 /
  *         \-------->-------
  *
   */

  const symbols = {
    a: {
      expression: '\\frac{b}{2}-c',
      arguments: null
    },
    a2: {
      expression: 'a^2',
      arguments: null
    },
    f: {
      arguments: ['x', 'y'],
      expression: 'a\\cdot x^2-b\\cdot y'
    },
    b: {
      expression: 'h\\left(4\\right)+c',
      arguments: null
    },
    h: {
      arguments: ['t'],
      expression: 't^{2}-1'
    },
    c: {
      expression: '-1',
      arguments: null
    },
    d: {
      expression: '1',
      arguments: null
    },
    p: {
      expression: 'c^2+d^2',
      arguments: null
    }
  }

  test('childMap is generated correctly', () => {
    const parserCache = new ParserCache()
    const expectedChildMap = {
      a: new Set( ['a2', 'f'] ),
      a2: new Set(),
      b: new Set( ['a', 'f'] ),
      c: new Set( ['a', 'b', 'p'] ),
      d: new Set( ['p'] ),
      f: new Set(),
      h: new Set( ['b'] ),
      p: new Set()
    }

    const actualChildMap = getChildMap(symbols, parserCache)

    expect(actualChildMap).toEqual(expectedChildMap)

  } )

  test('getDescendants works correctly', () => {
    const childMap = {
      a: new Set( ['f', 'a2'] ),
      a2: new Set(),
      b: new Set( ['a', 'f'] ),
      c: new Set( ['a', 'b', 'p'] ),
      d: new Set( ['p'] ),
      f: new Set(),
      h: new Set( ['b'] ),
      p: new Set()
    }
    expect(getDescendants('b', childMap)).toEqual(
      new Set( ['b', 'a', 'f', 'a2'] )
    )

  } )

  test('total evaluation order is generated correctly', () => {
    const parserCache = new ParserCache()
    const evalOrder = getEvalOrder(symbols, parserCache)
    // This is a valid order. there are other valid orders, too
    const expected = ['h', 'c', 'b', 'a', 'a2', 'f', 'd', 'p']

    expect(evalOrder).toEqual(expected)
  } )

  test('Subset of evaluation order is generated correct', () => {
    const parserCache = new ParserCache()
    const startingNode = 'b'
    const evalOrder = getEvalOrder(symbols, parserCache, startingNode)
    // This is a valid order. there are other valid orders, too
    const expected = [ 'b', 'a', 'a2', 'f' ]

    expect(evalOrder).toEqual(expected)
  } )

  test('cyclic dependencies raises error', () => {
    const cyclicSymbols = {
      a: {
        expression: 'b + 1',
        arguments: null
      },
      b: {
        expression: 'c + 1',
        arguments: null
      },
      c: {
        expression: 'a + 1',
        arguments: null
      }
    }
    const parserCache = new ParserCache()

    expect(() => getEvalOrder(cyclicSymbols, parserCache)).toThrow('Cyclic dependency:')
  } )

} )

describe('deserializing functions', () => {

  const funcName = 'h'
  const expression = 'a\\cdot s^2-b\\cdot g\\left(t\\right)'
  const argNames = ['s', 't']
  const mathScope = {
    a: 5,
    b: 2,
    g: t => t + 1 / t
  }
  const parserCache = new ParserCache()
  const func = deserializeFunction(funcName, { expression, argNames }, mathScope, parserCache)
  const expected = (s, t) => {
    const { a, b, g } = mathScope
    return a * s ** 2 - b * g(t)
  }

  test('deserialized function evaluates correctly', () => {
    expect(func(1.3, 4.1)).toBeCloseTo(expected(1.3, 4.1), DIGITS)
    expect(func(2.5, -3.6)).toBeCloseTo(expected(2.5, -3.6), DIGITS)
  } )

  test('deserialized function stores number of Arguments', () => {
    expect(func).toHaveLength(2)
  } )

  test('deserialized function name', () => {
    expect(func.name).toEqual('h')
  } )

  test('deserialized function raises error with wrong number of args', () => {
    expect(() => func(1))
      .toThrow('1 arguments supplied to function "h", expected 2 arguments')

    expect(() => func(1, 2, 3))
      .toThrow('3 arguments supplied to function "h", expected 2 arguments')
  } )

} )

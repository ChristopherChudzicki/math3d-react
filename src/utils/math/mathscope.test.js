import { deserialize, getEvalOrder } from './mathscope'
import ParserCache from './ParserCache'

const DIGITS = 6

describe('deserializing mathscope', () => {
  test('dependencies are sorted correctly', () => {
    const symbols = {
      a: {
        expression: 'b + c'
      },
      b: {
        expression: '2'
      },
      c: {
        expression: 'b + f(3)'
      },
      f: {
        expression: 'b\\cdot x^2',
        isFunction: true,
        arguments: ['x']
      }
    }
    const parserCache = new ParserCache()

    expect(getEvalOrder(symbols, parserCache)).toEqual( ['b', 'f', 'c', 'a'] )
  } )

  test('cyclic dependencies raises error', () => {
    const symbols = {
      a: {
        expression: 'b + 1'
      },
      b: {
        expression: 'c + 1'
      },
      c: {
        expression: 'a + 1'
      }
    }
    const parserCache = new ParserCache()

    expect(() => getEvalOrder(symbols, parserCache)).toThrow('Cyclic dependency: "c"')
  } )

  test('scope generated correctly when no errors present', () => {
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
        expression: '\\frac{b}{2}-c'
      },
      f: {
        arguments: ['x', 'y'],
        expression: 'a\\cdot x^2-b\\cdot y'
      },
      b: {
        expression: 'g\\left(4\\right)'
      },
      g: {
        arguments: ['t'],
        expression: 't^{2+d}+c'
      },
      c: {
        expression: '-1'
      },
      d: {
        expression: '1'
      }
    }

    const parserCache = new ParserCache()
    const mathScope = deserialize(symbols, parserCache)

    expect(mathScope.a).toBeCloseTo(expectedScope.a, DIGITS)
    expect(mathScope.b).toBeCloseTo(expectedScope.b, DIGITS)
    expect(mathScope.c).toBeCloseTo(expectedScope.c, DIGITS)
    expect(mathScope.d).toBeCloseTo(expectedScope.d, DIGITS)
  } )
} )

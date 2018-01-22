import { deserialize } from './mathscope'
import ParserCache from './ParserCache'

const DIGITS = 6

describe('deserializing mathscope', () => {
  test('dependencies resolve correctly when no errors present', () => {
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

    const serializedScope = {
      id0: {
        name: 'a',
        expression: '\\frac{b}{2}-c'
      },
      id1: {
        name: 'f\\left(x,y\\right)',
        expression: ''
      },
      id2: {
        name: 'b',
        expression: 'g\\left(4\\right)'
      },
      id3: {
        name: 'g\\left(t\\right)',
        expression: 't^{2+d}+c'
      },
      id4: {
        name: 'c',
        expression: '-1'
      },
      id5: {
        name: 'd',
        expression: '1'
      }
    }

    const parserCache = new ParserCache()
    const mathScope = deserialize(serializedScope, parserCache)

    expect(mathScope.a).toBeCloseTo(expectedScope.a, DIGITS)
    expect(mathScope.b).toBeCloseTo(expectedScope.b, DIGITS)
    expect(mathScope.c).toBeCloseTo(expectedScope.c, DIGITS)
    expect(mathScope.d).toBeCloseTo(expectedScope.d, DIGITS)
  } )
} )

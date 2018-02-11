import ParserCache from './ParserCache'
import MathExpression from './MathExpression'
const DIGITS = 6

describe('ParserCache', () => {
  test('getParsed returns ParsedExpression objects', () => {
    const parserCache = new ParserCache()
    const parsed = parserCache.getParsed('f(x) + \\frac{y^2}{2}')
    const scope = { x: 9, y: 4, f: Math.sqrt } // 3+16/2 = 11
    expect(parsed).toBeInstanceOf(MathExpression)
    expect(parsed.eval(scope)).toBeCloseTo(11, DIGITS)
  } )

  test('uses cache when possible', () => {
    const parserCache = new ParserCache()
    jest.spyOn(parserCache, 'getParsed')
    jest.spyOn(parserCache, 'addToCache')

    parserCache.getParsed('a + b')
    parserCache.getParsed('a + b')
    parserCache.getParsed('a + b')

    expect(parserCache.getParsed).toHaveBeenCalledTimes(3)
    expect(parserCache.addToCache).toHaveBeenCalledTimes(1)
  } )
} )

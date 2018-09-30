import Parser, { getUsedSymbols } from './Parser'
import MathExpression from './MathExpression'
const DIGITS = 6

describe('Parser', () => {
  test('getParsed returns ParsedExpression objects', () => {
    const parser = new Parser()
    const parsed = parser.parse('f(x) + \\frac{y^2}{2}')
    const scope = { x: 9, y: 4, f: Math.sqrt } // 3+16/2 = 11
    expect(parsed).toBeInstanceOf(MathExpression)
    expect(parsed.eval(scope)).toBeCloseTo(11, DIGITS)
  } )

  test('uses cache when possible', () => {
    const parser = new Parser()
    jest.spyOn(parser, 'parse')
    jest.spyOn(parser, 'addToCache')

    parser.parse('a + b')
    parser.parse('a + b')
    parser.parse('a + b')

    expect(parser.parse).toHaveBeenCalledTimes(3)
    expect(parser.addToCache).toHaveBeenCalledTimes(1)
  } )

  test('Errors are cached before being thrown', () => {
    const parser = new Parser()
    jest.spyOn(parser, 'parse')
    jest.spyOn(parser, 'addToCache')

    try { parser.parse('a + ') }
    catch (err) { }
    try { parser.parse('a + ') }
    catch (err) { }
    try { parser.parse('a + ') }
    catch (err) { }

    expect(parser.parse).toHaveBeenCalledTimes(3)
    expect(parser.addToCache).toHaveBeenCalledTimes(1)

  } )
} )

test('getUsedSymbols', () => {
  const parser = new Parser()
  const expressions = [
    'a+f\\left(t\\right)',
    'b + x',
    '2^{g\\left(x,y\\right)}'
  ]
  // Function arguments should not be deteceted
  const usedSymbols = new Set( ['a', 'f', 't', 'b', 'x', 'g', 'y'] )
  expect(getUsedSymbols(parser, expressions)).toEqual(usedSymbols)
} )

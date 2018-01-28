import ParsedExpression from './ParsedExpression'
import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to'
expect.extend( { toBeDeepCloseTo } )

const DIGITS = 6

describe('ParsedExpression', () => {
  test('detects dependencies', () => {
    const expression = 'f(4x, b*y, g(z)) + sin(t^2) - sqrt(4*B)'
    const dependencies = ['B', 't', 'z', 'y', 'b', 'x', 'f', 'g', 'sin', 'sqrt']
    const parsed = new ParsedExpression(expression)

    expect(parsed.dependencies.sort()).toEqual(dependencies.sort())
  } )

  test('eval function is assigned and works', () => {
    const expression = 'a + b^2 + f(4)'
    const scope = { a: 3, b: 5, f: Math.sqrt }
    const expected = 3 + 25 + 2
    const parsed = new ParsedExpression(expression)
    expect(parsed.eval(scope)).toBeCloseTo(expected, DIGITS)
  } )

  test('eval function returns array when expression contains [', () => {
    const expression = 'i + [1, 2, 3]'
    const scope = { i: [1, 0, 0] }
    const expected = [2, 2, 3]
    const parsed = new ParsedExpression(expression)
    expect(parsed.eval(scope)).toBeDeepCloseTo(expected, DIGITS)
  } )

  test('applies all preprocessors', () => {
    const preprocessors = [
      str => `${str} + 1`,
      str => `${str} + 1/2`
    ]
    const expression = '0'
    const parsed = new ParsedExpression(expression, preprocessors)
    expect(parsed.eval( {} )).toBeCloseTo(1.5, DIGITS)
  } )

  test('applies all postprocessors', () => {
    const postprocessors = [
      node => { node.comment += '1' },
      node => { node.comment += '2' }
    ]
    const parsed = new ParsedExpression('a + b', [], postprocessors)
    const plusNode = parsed.parseTree
    expect(plusNode.comment).toBe('12')
    expect(plusNode.args[0].comment).toBe('12')
    expect(plusNode.args[1].comment).toBe('12')
  } )

  // Describe operator replacement & test with evaluation

  // Describe error handling
} )

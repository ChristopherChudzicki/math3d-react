import MathExpression from './MathExpression'
import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to'
expect.extend( { toBeDeepCloseTo } )

const DIGITS = 6

describe('Dependency Detection', () => {

  test('dependencies detected for normal expressions', () => {
    const expression = 'A + f(4x, b*y, g(z)) + sin(t^2) - sqrt(4*B) - b*z/sin(t)'
    const dependencies = new Set( ['A', 'B', 't', 'z', 'y', 'b', 'x', 'f', 'g', 'sin', 'sqrt'] )
    const parsed = new MathExpression(expression)

    expect(parsed.dependencies).toEqual(dependencies)
  } )

  test('dependencies detected for variable assignment', () => {
    const expression = 'A = f(4x, b*y, g(z)) + sin(t^2) - sqrt(4*B) - b*z/sin(t)'
    const dependencies = new Set( ['B', 't', 'z', 'y', 'b', 'x', 'f', 'g', 'sin', 'sqrt'] )
    const parsed = new MathExpression(expression)

    expect(parsed.dependencies).toEqual(dependencies)
  } )

  test('dependencies detected for function assignment', () => {
    const expression = 'A(x, z) = f(4x, b*y, g(z)) + sin(t^2) - sqrt(4*B) - b*z/sin(t)'
    const dependencies = new Set( ['B', 't', 'y', 'b', 'f', 'g', 'sin', 'sqrt'] )
    const parsed = new MathExpression(expression)

    expect(parsed.dependencies).toEqual(dependencies)
  } )

  test('Cyclic Assignment raises error', () => {
    expect(() => {
      new MathExpression('a = 4 + a') // eslint-disable-line no-new
    } ).toThrow('Cyclic Assignment Error')
  } )

  test('Single symbol does not raise cyclic assignment raises error', () => {
    expect(() => {
      new MathExpression('a') // eslint-disable-line no-new
    } ).not.toThrow('Cyclic Assignment Error')
  } )

  test('Cyclic Paramater Assignment raises error', () => {
    expect(() => {
      new MathExpression('f(f) = x^2') // eslint-disable-line no-new
    } ).toThrow('Cyclic Assignment Error')
  } )

} )

describe('Preprocessors and Postprocessors function correctly', () => {
  test('applies all preprocessors', () => {
    const preprocessors = [
      str => `${str} + 1`,
      str => `${str} + 1/2`
    ]
    const expression = '0'
    const parsed = new MathExpression(expression, preprocessors)
    expect(parsed.eval( {} )).toBeCloseTo(1.5, DIGITS)
  } )

  test('applies all postprocessors', () => {
    const postprocessors = [
      node => { node.comment += '1' },
      node => { node.comment += '2' }
    ]
    const parsed = new MathExpression('a + b', [], postprocessors)
    const plusNode = parsed.tree
    expect(plusNode.comment).toBe('12')
    expect(plusNode.args[0].comment).toBe('12')
    expect(plusNode.args[1].comment).toBe('12')
  } )
} )

describe('Evaluation and Name Assignment', () => {

  test('Standard expressions evaluate correctly and have null name', () => {
    const expression = 'a + b^2 + f(4)'
    const scope = { a: 3, b: 5, f: Math.sqrt }
    const expected = 3 + 25 + 2
    const parsed = new MathExpression(expression)
    expect(parsed.eval(scope)).toBeCloseTo(expected, DIGITS)
    expect(parsed.name).toBe(null)
  } )

  test('Evaluation returns array when expression contains [', () => {
    const expression = 'i + [1, 2, 3]'
    const scope = { i: [1, 0, 0] }
    const expected = [2, 2, 3]
    const parsed = new MathExpression(expression)
    expect(parsed.eval(scope)).toBeDeepCloseTo(expected, DIGITS)
  } )

  test('Assignment expressions evaluate correctly and have correct name', () => {
    const expression = 'w = a + b^2 + f(4)'
    const scope = { a: 3, b: 5, f: Math.sqrt }
    const expected = 3 + 25 + 2
    const parsed = new MathExpression(expression)
    expect(parsed.eval(scope)).toBeCloseTo(expected, DIGITS)
    expect(parsed.name).toBe('w')
  } )

  test('Function Assignment expressions evaluate correctly and have correct name', () => {
    const expression = 'g(x, y) = a + b^2 + f(x) - y'
    const scope = { a: 3, b: 5, f: Math.sqrt }
    const expected = (x, y) => 3 + 25 + Math.sqrt(x) - y
    const parsed = new MathExpression(expression)

    const func = parsed.eval(scope)
    expect(func(8, 5)).toBeCloseTo(expected(8, 5), DIGITS)
    expect(func(2.3, 8.6)).toBeCloseTo(expected(2.3, 8.6), DIGITS)
    expect(parsed.name).toBe('g')
  } )

} )

import {
  updateMathScope,
  genMathScope,
  getEvalOrder,
  getChildMap,
  getDescendantsOfNode,
  getDescendants
}
  from './mathscope'
import Parser from './Parser'

const DIGITS = 6

describe('deserializing mathscope', () => {

  test('scope created correctly when no errors present', () => {

    const symbols = {
      a: 'a=\\frac{b}{2}-c',
      f: 'f\\left(x,y\\right)=a\\cdot x^2-b\\cdot y',
      b: 'b=g\\left(4\\right)',
      g: 'g\\left(t\\right)=t^{2+d}+c',
      c: 'c=-1',
      d: 'd=1',
      w: 'w=(d+1)^2'
    }

    const expectedScope = {
      a: 32.5,
      b: 63,
      c: -1,
      d: 1,
      w: 4,
      f: (x, y) => 32.5 * (x ** 2) - 63 * y,
      g: t => t ** 3 - 1
    }
    const expectedUpdated = ['a', 'b', 'c', 'd', 'w', 'f', 'g']

    const parser = new Parser()
    const { mathScope, updated, errors } = genMathScope(symbols, parser)

    expect(mathScope.a).toBeCloseTo(expectedScope.a, DIGITS)
    expect(mathScope.b).toBeCloseTo(expectedScope.b, DIGITS)
    expect(mathScope.c).toBeCloseTo(expectedScope.c, DIGITS)
    expect(mathScope.d).toBeCloseTo(expectedScope.d, DIGITS)
    expect(mathScope.w).toBeCloseTo(expectedScope.w, DIGITS)
    expect(mathScope.f(2, 7)).toBeCloseTo(expectedScope.f(2, 7), DIGITS)
    expect(mathScope.g(5)).toBeCloseTo(expectedScope.g(5), DIGITS)

    expect(updated.sort()).toEqual(expectedUpdated.sort())
    expect(errors).toEqual( {} )
  } )

  test('updating an existing mathscope', () => {
    const newSymbols = {
      a: 'a=\\frac{b}{2}-c',
      f: 'f\\left(x,y\\right)=a\\cdot x^2-b\\cdot y',
      b: 'b=g\\left(5\\right)',
      g: 'g\\left(t\\right)=t^{2+d}+c',
      c: 'c=-1',
      d: 'd=1',
      w: 'w=(d+1)^3'
    }

    const initialScope = {
      a: 32.5,
      b: 63,
      c: -1,
      d: 1,
      w: 4,
      f: (x, y) => 32.5 * (x ** 2) - 63 * y,
      g: t => t ** 3 - 1
    }

    const expectedScope = {
      a: 63,
      b: 124,
      c: -1,
      d: 1,
      w: 8,
      f: (x, y) => 63 * (x ** 2) - 124 * y,
      g: t => t ** 3 - 1
    }
    const expectedUpdated = ['a', 'b', 'f', 'w']

    const parser = new Parser()
    const {
      mathScope,
      updated,
      errors
    } = updateMathScope(newSymbols, parser, initialScope, ['b', 'w'] )

    // mathscope should be a new object, not the same as initialScope
    expect(mathScope).not.toBe(initialScope)

    // mathscope should behave correctly
    expect(mathScope.a).toBeCloseTo(expectedScope.a, DIGITS)
    expect(mathScope.b).toBeCloseTo(expectedScope.b, DIGITS)
    expect(mathScope.c).toBeCloseTo(expectedScope.c, DIGITS)
    expect(mathScope.d).toBeCloseTo(expectedScope.d, DIGITS)
    expect(mathScope.w).toBeCloseTo(expectedScope.w, DIGITS)
    expect(mathScope.f(2, 7)).toBeCloseTo(expectedScope.f(2, 7), DIGITS)
    expect(mathScope.g(5)).toBeCloseTo(expectedScope.g(5), DIGITS)

    // updated list should be correct
    expect(updated.sort()).toEqual(expectedUpdated.sort())

    // no errors
    expect(errors).toEqual( {} )
  } )

  test('errors get stored', () => {
    const symbols = {
      a: '[1, 2, 3]',
      b: '2^a'
    }

    const parser = new Parser()
    const { mathScope, errors } = genMathScope(symbols, parser)

    expect(mathScope.a).toEqual( [1, 2, 3] )
    expect(errors.b).toBeInstanceOf(Error)
    expect(() => { throw errors.b } )
      .toThrow('Unexpected type of argument')

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
    a: 'a=\\frac{b}{2}-c',
    a2: 'a2=a^2',
    f: 'f\\left(x,y\\right)=a\\cdot x^2-b\\cdot y',
    b: 'h\\left(4\\right)+c',
    h: 'h\\left(t\\right)=t^{2}-1',
    c: '-1',
    d: '1',
    p: 'c^2+d^2'
  }

  test('childMap is generated correctly', () => {
    const parser = new Parser()
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

    const actualChildMap = getChildMap(symbols, parser)

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
    expect(getDescendantsOfNode('b', childMap)).toEqual(
      new Set( ['b', 'a', 'f', 'a2'] )
    )

    expect(getDescendants(['b', 'd'], childMap)).toEqual(
      new Set( ['b', 'a', 'f', 'a2', 'd', 'p'] )
    )

  } )

  test('total evaluation order is generated correctly', () => {
    const parser = new Parser()
    const evalOrder = getEvalOrder(symbols, parser)
    // This is a valid order. there are other valid orders, too
    const expected = ['h', 'c', 'b', 'a', 'a2', 'f', 'd', 'p']

    expect(evalOrder).toEqual(expected)
  } )

  test('Subset of evaluation order is generated correct', () => {
    const parser = new Parser()
    const onlyChildrenOf = ['b']
    const evalOrder = getEvalOrder(symbols, parser, onlyChildrenOf)
    // This is a valid order. there are other valid orders, too
    const expected = [ 'b', 'a', 'f', 'a2' ]

    expect(evalOrder).toEqual(expected)
  } )

  test('cyclic dependencies raises error', () => {
    const cyclicSymbols = {
      a: 'a=b+1',
      b: 'b=c+1',
      c: 'c=a+1'
    }
    const parser = new Parser()

    expect(() => getEvalOrder(cyclicSymbols, parser)).toThrow('Cyclic dependency:')
  } )

} )

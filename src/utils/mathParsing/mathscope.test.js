import {
  evalScope,
  getEvalOrder,
  getChildMap,
  getDescendantsOfNode,
  getDescendants,
  ScopeEvaluator
}
  from './mathscope'
import { toNearlyEqual } from './matchers'
import Parser from './Parser'

// For comparing approximate equality of arrays, functions, objects.
// For numbers, this uses a default tolerance of 1e-6
expect.extend( {
  toNearlyEqual
} )

describe('evalScope', () => {

  describe('evaluating a new scope from scratch without errors', () => {

    const symbols = {
      a: 'a=\\frac{b}{2}-c',
      f: 'f\\left(x,y\\right)=a\\cdot x^2-b\\cdot y',
      b: 'b=g\\left(4\\right)',
      g: 'g\\left(t\\right)=t^{2+d}+c',
      c: 'c=-1',
      d: 'd=1',
      w: 'w=(d+1)^2',
      y: 'y=100'
    }
    const expectedScope = {
      a: 32.5,
      b: 63,
      c: -1,
      d: 1,
      w: 4,
      y: 100,
      f: (x, y) => 32.5 * (x ** 2) - 63 * y,
      g: t => t ** 3 - 1
    }

    const expectedUpdated = new Set(Object.keys(expectedScope))

    const parser = new Parser()
    const { scope, updated, errors } = evalScope(parser, symbols)

    test("scope's symbol evaluations are correct", () => {
      expect(scope).toNearlyEqual(expectedScope)
    } )

    test('updated symbols recorded accurately', () => {
      expect(updated).toEqual(expectedUpdated)
    } )

    test('No errors created', () => {
      expect(errors).toEqual( {} )
    } )

  } )

  describe('updating an existing scope evaluation', () => {
    const newSymbols = {
      a: 'a=\\frac{b}{2}-c',
      f: 'f\\left(x,y\\right)=a\\cdot x^2-b\\cdot y',
      b: 'b=g\\left(5\\right)', // changed
      g: 'g\\left(t\\right)=t^{2+d}+c',
      c: 'c=-1',
      d: 'd=1',
      w: 'w=(d+1)^3', // changed
      y: 'y=150' // changed
    }

    const oldScope = {
      a: 32.5,
      b: 63,
      c: -1,
      d: 1,
      w: 4,
      y: 100,
      f: (x, y) => 32.5 * (x ** 2) - 63 * y,
      g: t => t ** 3 - 1
    }
    const changed = ['b', 'w', 'y']

    const expectedScope = {
      a: 63,
      b: 124,
      c: -1,
      d: 1,
      w: 8,
      y: 150,
      f: (x, y) => 63 * (x ** 2) - 124 * y,
      g: t => t ** 3 - 1
    }
    const expectedUpdated = new Set( ['a', 'b', 'f', 'w', 'y'] )

    const parser = new Parser()
    const {
      scope,
      updated,
      errors
    } = evalScope(parser, newSymbols, oldScope, changed)

    test('updating scope creates a new object', () => {
      expect(scope).not.toBe(oldScope)
    } )

    test("scope's symbol evaluations are correct", () => {
      expect(updated).toEqual(expectedUpdated)
    } )

    test('updated symbols recorded accurately', () => {
      expect(updated).toEqual(expectedUpdated)
    } )

    test('No errors created', () => {
      expect(errors).toEqual( {} )
    } )

  } )

  describe('storing errors', () => {

    const symbols = {
      a: '[1, 2, 3]',
      b: '2^a'
    }

    const parser = new Parser()
    const { scope, errors } = evalScope(parser, symbols)

    test('Error is created and stored', () => {
      expect(errors.b).toBeInstanceOf(Error)
      expect(() => { throw errors.b } )
        .toThrow('Unexpected type of argument')
    } )

    test('Unrelated symbols are evaluated correctly', () => {
      expect(scope.a).toEqual( [1, 2, 3] )
    } )

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
    z: '100', // isolated node, no parents or children
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
      p: new Set(),
      z: new Set()
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

    expect(getDescendants( ['b', 'd'], childMap)).toEqual(
      new Set( ['b', 'a', 'f', 'a2', 'd', 'p'] )
    )

  } )

  test('total evaluation order is generated correctly', () => {
    const parser = new Parser()
    const evalOrder = getEvalOrder(symbols, parser)
    // This is a valid order. there are other valid orders, too
    const expected = ['h', 'c', 'b', 'a', 'a2', 'f', 'd', 'p', 'z']

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

describe('class ScopeEvaluator', () => {

  const symbols0 = {
    a: 'a=[4,-2,b]',
    b: 'b=f(2)',
    f: 'f(t)=t^3',
    w: 'w=-15'
  }
  const expectedScope0 = {
    a: [4, -2, 8],
    b: 8,
    f: t => t**3,
    w: -15
  }

  const symbols1 = {
    a: 'a=[4,-2,b]', // parent changed
    b: 'b=f(3)', // direct change
    f: 'f(t)=t^3',
    w: 'w=-15'
  }
  const expectedScope1 = {
    a: [4, -2, 27],
    b: 27,
    f: t => t**3,
    w: -15
  }

  test('initial evaluation is correct', () => {
    const parser = new Parser()
    const scopeEvaluator = new ScopeEvaluator(parser)

    const { scope } = scopeEvaluator.evalScope(symbols0)
    expect(scope).toNearlyEqual(expectedScope0)
  } )

  test('provides cached result if symbols are identical', () => {
    const parser = new Parser()
    const scopeEvaluator = new ScopeEvaluator(parser)
    const recalculateScope = jest.spyOn(scopeEvaluator, '_recalculateScope')

    expect(recalculateScope).toHaveBeenCalledTimes(0)
    const { firstEval } = scopeEvaluator.evalScope(symbols0)
    const { secondEval } = scopeEvaluator.evalScope(symbols0)
    expect(recalculateScope).toHaveBeenCalledTimes(1)
    expect(firstEval).toBe(secondEval)
  } )

  test('when symbols are updated but not added/removed, scope is patched', () => {
    const parser = new Parser()
    const scopeEvaluator = new ScopeEvaluator(parser)
    const recalculateScope = jest.spyOn(scopeEvaluator, '_recalculateScope')
    const patchScope = jest.spyOn(scopeEvaluator, '_patchScope')

    expect(recalculateScope).toHaveBeenCalledTimes(0)
    expect(patchScope).toHaveBeenCalledTimes(0)
    scopeEvaluator.evalScope(symbols0)
    const { scope: patchedScope } = scopeEvaluator.evalScope(symbols1)
    expect(recalculateScope).toHaveBeenCalledTimes(1)
    expect(patchScope).toHaveBeenCalledTimes(1)
    expect(patchedScope).toNearlyEqual(expectedScope1)
  } )

  test('adding and removing symbols', () => {
    const parser = new Parser()
    const scopeEvaluator = new ScopeEvaluator(parser)
    const recalculateScope = jest.spyOn(scopeEvaluator, '_recalculateScope')

    const symbols = { a: '1', b: '2' }
    const expectedScope = { a: 1, b: 2 }
    const addedSymbols = { c: '3', ...symbols }
    const addedScope = { c: 3, ...expectedScope }

    expect(recalculateScope).toHaveBeenCalledTimes(0)
    expect(scopeEvaluator.evalScope(symbols).scope).toNearlyEqual(expectedScope)
    expect(recalculateScope).toHaveBeenCalledTimes(1)
    expect(scopeEvaluator.evalScope(addedSymbols).scope).toNearlyEqual(addedScope)
    expect(recalculateScope).toHaveBeenCalledTimes(2)
    expect(scopeEvaluator.evalScope(symbols).scope).toNearlyEqual(expectedScope)

  } )

} )

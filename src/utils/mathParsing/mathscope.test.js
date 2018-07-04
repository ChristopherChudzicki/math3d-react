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
      expect(scope).toNearlyEqual(expectedScope)
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
      a: 'a=[1, 2, 3]',
      b: 'b=2^a',
      c: 'c=2+d',
      d: 'd=2+w',
      f: 'f(t)=t+d'
    }

    const parser = new Parser()
    const { scope, errors } = evalScope(parser, symbols)

    test('Type Error is caught and stored', () => {
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
  *     w = 100
  *
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
  * w (isolated)
  *
  */

  const symbols = {
    a: 'a=\\frac{b}{2}-c',
    a2: 'a2=a^2',
    f: 'f\\left(x,y\\right)=a\\cdot x^2-b\\cdot y',
    b: 'h\\left(4\\right)+c',
    h: 'h\\left(t\\right)=t^{2}-1',
    c: 'c=-1',
    d: 'd=1',
    w: 'w=100', // isolated node, no parents or children
    p: 'p=c^2+d^2'
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
      w: new Set()
    }

    const childMap = getChildMap(symbols, parser)

    expect(childMap).toEqual(expectedChildMap)

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
    const childMap = getChildMap(symbols, parser)
    const evalOrder = getEvalOrder(symbols, childMap)
    // This is a valid order. there are other valid orders, too
    const expected = ['h', 'c', 'b', 'a', 'a2', 'f', 'd', 'p', 'w']

    expect(evalOrder).toEqual(expected)
  } )

  test('Subset of evaluation order is generated correct', () => {
    const parser = new Parser()
    const onlyChildrenOf = ['b']
    const childMap = getChildMap(symbols, parser)
    const evalOrder = getEvalOrder(symbols, childMap, onlyChildrenOf)
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
    const childMap = getChildMap(cyclicSymbols, parser)

    expect(() => getEvalOrder(cyclicSymbols, childMap)).toThrow('Cyclic dependency:')
  } )

} )

describe('handling unmet dependencies', () => {
  /*
  * a = 2
  * b = 3
  * c = a + b       5
  * d = c^2 + b     28
  * y = a + x
  * z = y^2
  * f(t) = t^2 + d * g(t)
  * g(t) = t + w
  * Missing:
  * w, x
  *
  * Graph:
  *
  *      ?-- x -->
  *               \
  * a --->----->-- y -->-- z
  *       \
  * b -->--- c -->-- d ------->--- f
  *       \-->--/               /
  *                      g -->-/
  *         ? -- w -->--/
  *
  */
  const symbols = {
    a: 'a=2',
    b: 'b=3',
    c: 'c=a+b',
    d: 'd=c^2+b',
    y: 'y=a+x',
    z: 'z=y^2',
    f: 'f(t)=t^2+d\\cdot g(t)',
    g: 'g(t)=t+w'
  }

  describe('how getChildMap handles unmet dependencies', () => {
    const parser = new Parser()
    const childMap = getChildMap(symbols, parser)
    it('includes unmet dependencies in the returned childMap', () => {
      const expectedChildMap = {
        y: new Set( ['z'] ),
        z: new Set(),
        a: new Set( ['c', 'y'] ),
        b: new Set( ['c', 'd'] ),
        c: new Set( ['d'] ),
        d: new Set( ['f'] ),
        g: new Set( ['f'] ),
        f: new Set()
      }

      expect(childMap).toEqual(expectedChildMap)
    } )
  } )

  describe('how evalScope handles unmet dependencies', () => {
    const parser = new Parser()
    const { scope, errors } = evalScope(parser, symbols)
    it('evaluates as much of the scope as it can', () => {
      const expectedScope = {
        a: 2,
        b: 3,
        c: 5,
        d: 28
      }
      expect(scope).toNearlyEqual(expectedScope)
    } )

    it('stores errors for the unmet dependencies', () => {
      expect(() => { throw errors.y } )
        .toThrow('Undefined symbol x')
      expect(() => { throw errors.z } )
        .toThrow('Undefined symbol y')
      expect(() => { throw errors.f } )
        .toThrow('Eval Error: Depends on undefined symbol g')
      expect(() => { throw errors.g } )
        .toThrow('Eval Error: Depends on undefined symbol w')
    } )
  } )

  it('hanldes unmet dependencies during scope patches', () => {
    const parser = new Parser()
    const symbols = { f: 'f()=x' }
    const oldScope = { f: x => x }
    const changed = new Set( ['f'] )
    const { scope, errors, updated } = evalScope(parser, symbols, oldScope, changed)
    expect(() => { throw errors.f } )
      .toThrow('Eval Error: Depends on undefined symbol x')
    // f was not updated
    expect(scope).toEqual( {} )
    expect(updated).toEqual(new Set( ['f'] ))

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

  it('correctly evaluates the initial scope', () => {
    const parser = new Parser()
    const scopeEvaluator = new ScopeEvaluator(parser)

    const { scope } = scopeEvaluator.evalScope(symbols0)
    expect(scope).toNearlyEqual(expectedScope0)
  } )

  it('provides cached result if symbols are identical', () => {
    const parser = new Parser()
    const scopeEvaluator = new ScopeEvaluator(parser)
    const recalculateScope = jest.spyOn(scopeEvaluator, '_recalculateScope')

    expect(recalculateScope).toHaveBeenCalledTimes(0)
    const { firstEval } = scopeEvaluator.evalScope(symbols0)
    const { secondEval } = scopeEvaluator.evalScope(symbols0)
    expect(recalculateScope).toHaveBeenCalledTimes(1)
    expect(firstEval).toBe(secondEval)
  } )

  it('patches the result when symbols are updated but not added/removed', () => {
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

  it('updates errors correctly when updating scope', () => {
    const parser = new Parser()
    const scopeEvaluator = new ScopeEvaluator(parser)

    const symbols0 = {
      v: 'v=y+1',
      w: 'w=2',
      x: 'x=2^[1,2,3]',
      y: 'y=x^2',
      z: 'z=[1, 1, 1]'
    }

    const symbols1 = {
      v: 'v=y+1',
      w: 'w=2',
      x: 'x=2^[1,2,3]',
      y: 'y=w^2',
      z: 'z=[1, 1, 1]'
    }

    const result0 = scopeEvaluator.evalScope(symbols0)
    const result1 = scopeEvaluator.evalScope(symbols1)

    expect(result0.scope).toNearlyEqual( { w: 2, z: [1, 1, 1] } )
    expect(Object.keys(result0.errors).sort()).toEqual( ['v', 'x', 'y'] )
    expect(result0.updated).toEqual(new Set( ['v', 'w', 'x', 'y', 'z'] ))

    expect(result1.scope).toNearlyEqual( { v: 5, w: 2, y: 4, z: [1, 1, 1] } )
    expect(Object.keys(result1.errors).sort()).toEqual( ['x'] )
    expect(result1.updated).toEqual(new Set( ['v', 'y'] ))
  } )

  it('recalculates scope when symbols are added/removed', () => {
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

import {
  evalScope,
  getEvalOrder,
  getChildMap,
  removeCycles,
  getDescendantsOfNode,
  getDescendants,
  ScopeEvaluator
}
  from './mathscope'
import { toNearlyEqual } from './matchers'
import Parser from './Parser'
import diff from 'shallow-diff'

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

    const parser = new Parser()
    const { scope, errors } = evalScope(parser, symbols)

    test("scope's symbol evaluations are correct", () => {
      expect(scope).toNearlyEqual(expectedScope)
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
      errors
    } = evalScope(parser, newSymbols, oldScope, changed)

    test('updating scope creates a new object', () => {
      expect(scope).not.toBe(oldScope)
    } )

    test("scope's symbol evaluations are correct", () => {
      expect(scope).toNearlyEqual(expectedScope)
    } )

    test('Unchanged symbol values are strictly equal to old values', () => {
      expect(scope.g).toBeInstanceOf(Function)
      expect(scope.g).toBe(oldScope.g)
    } )

    test('updated symbols recorded accurately', () => {
      const updated = new Set(diff(scope, oldScope).updated)
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
      f: 'f(t)=t+d',
      x: 'x=y+1',
      y: 'y=x+1',
      z: 'z=x+a'
    }

    const parser = new Parser()
    const { scope, errors } = evalScope(parser, symbols)

    test('Unrelated symbols are evaluated correctly', () => {
      expect(scope.a).toEqual( [1, 2, 3] )
    } )

    test('Expected errors are caught', () => {
      expect(new Set(Object.keys(errors))).toEqual(new Set(
        ['b', 'c', 'd', 'f', 'x', 'y', 'z']
      ))
    } )

    test('Type Error is caught and stored', () => {
      expect(errors.b).toBeInstanceOf(Error)
      expect(() => { throw errors.b } )
        .toThrow('Unexpected type of argument')
    } )

    test('Cyclic assignment errors are caught', () => {
      expect(errors.x).toBeInstanceOf(Error)
      expect(() => { throw errors.x } )
        .toThrow('Symbol x has cyclic dependencies: x, y')

      expect(errors.y).toBeInstanceOf(Error)
      expect(() => { throw errors.y } )
        .toThrow('Symbol y has cyclic dependencies: x, y')

      expect(errors.z).toBeInstanceOf(Error)
      expect(() => { throw errors.z } )
        .toThrow('Undefined symbol x')
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
    const { evalOrder, cycles } = getEvalOrder(symbols, childMap)
    // This is a valid order. there are other valid orders, too
    const expected = ['h', 'c', 'b', 'a', 'a2', 'f', 'd', 'p', 'w']

    expect(evalOrder).toEqual(expected)
    expect(cycles).toEqual( {} )
  } )

  test('Subset of evaluation order is generated correct', () => {
    const parser = new Parser()
    const onlyChildrenOf = ['b']
    const childMap = getChildMap(symbols, parser)
    const { evalOrder, cycles } = getEvalOrder(symbols, childMap, onlyChildrenOf)
    // This is a valid order. there are other valid orders, too
    const expected = [ 'b', 'a', 'f', 'a2' ]

    expect(evalOrder).toEqual(expected)
    expect(cycles).toEqual( {} )
  } )

  test('cyclic dependencies raises error', () => {
    const cyclicSymbols = {
      a: 'a=b+1',
      b: 'b=c+1',
      c: 'c=a+1'
    }
    const parser = new Parser()
    const childMap = getChildMap(cyclicSymbols, parser)
    const { cycles } = getEvalOrder(cyclicSymbols, childMap)

    expect(cycles).toEqual( {
      a: ['a', 'b', 'c'],
      b: ['a', 'b', 'c'],
      c: ['a', 'b', 'c']
    } )
  } )

} )

describe('removeCycles', () => {
  /*
   *
   * a -->--\             /-->-- f
   *         \-->-- c -->
   * b -->--/             \-->-- g
   *        \--> d -->---/
   *           /   \
   *        down   up
   *           \-e-/
   *
   * x -->-- y
   *  |--<--/
   *
   * s ----/
   *  \-<-/
   *
   * t
   *
   */

  const childMap = {
    a: new Set( ['c'] ),
    b: new Set( ['c', 'd'] ),
    c: new Set( ['f', 'g'] ),
    d: new Set( ['e', 'g'] ),
    e: new Set( ['d'] ),
    x: new Set( ['y'] ),
    y: new Set( ['x'] ),
    s: new Set( ['s'] ),
    t: new Set( [] )
  }

  it('removes cycles', () => {
    const { withoutCycles, cycles } = removeCycles(childMap)
    expect(withoutCycles).toEqual( {
      a: new Set( ['c'] ),
      b: new Set( ['c'] ),
      c: new Set( ['f', 'g'] ),
      t: new Set( [] )
    } )
    expect(cycles).toEqual( {
      d: ['d', 'e'],
      e: ['d', 'e'],
      x: ['x', 'y'],
      y: ['x', 'y'],
      s: ['s']
    } )
  } )

} )

describe('getEvalOrder with cycles', () => {
  /*
   *
   * a -->--\             /-->-- f
   *         \-->-- c -->
   * b -->--/             \-->-- g
   *        \--> d -->---/
   *           /   \
   *        down   up
   *           \-e-/
   *
   * x -->-- y
   *  |--<--/
   *
   * t
   *
   */

  const symbols = {
    a: 'a=1',
    b: 'b=1',
    c: 'c=a+b',
    d: 'd=b+e',
    e: 'e=d',
    f: 'f=c',
    g: 'g=c+d',
    x: 'x=y',
    y: 'y=x',
    t: 't=5'
  }

  it('generates evalOrder and cycles', () => {
    const parser = new Parser()
    const childMap = getChildMap(symbols, parser)
    const { evalOrder, cycles } = getEvalOrder(symbols, childMap)
    expect(evalOrder).toEqual( ['a', 'b', 'c', 'f', 'g', 't'] )
    expect(cycles).toEqual( {
      d: ['d', 'e'],
      e: ['d', 'e'],
      x: ['x', 'y'],
      y: ['x', 'y']
    } )
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
        .toThrow('Eval Error: Depends on undefined symbol(s) g')
      expect(() => { throw errors.g } )
        .toThrow('Eval Error: Depends on undefined symbol(s) w')
    } )
  } )

  it('hanldes unmet dependencies during scope patches', () => {
    const parser = new Parser()
    const symbols = { f: 'f()=x' }
    const oldScope = { f: x => x }
    const changed = new Set( ['f'] )
    const { scope, errors } = evalScope(parser, symbols, oldScope, changed)
    expect(() => { throw errors.f } )
      .toThrow('Eval Error: Depends on undefined symbol(s) x')
    // f was not updated
    expect(scope).toEqual( {} )

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

  it('correctly records scope and errors diff', () => {
    const parser = new Parser()
    const scopeEvaluator = new ScopeEvaluator(parser)

    const symbols0 = {
      v: 'v=y+1',         // error (from 2nd ancestor)
      w: 'w=2',           // ok
      x: 'x=2^[1,2,3]',   // error
      y: 'y=x^2',         // error (from 1st ancestor)
      z: 'z=[1, 1, 1]'    // ok
    }

    const symbols1 = {
      v: 'v=y+t',        // error: changed
      w: 'w=2',          // scope: unchanged
      x: 'x=2^[1,2,3]',  // error: unchanged
      y: 'y=w^2',        // scope: added, error: removed
      z: 'z=[2, 1, 1]'   // scope: unchanged
    }

    function sortDiff(obj) {
      for (const key of Object.keys(obj)) {
        obj[key].sort()
      }
      return obj
    }

    const {
      scope: scope0,
      scopeDiff: scopeDiff0,
      errors: errors0,
      errorsDiff: errorsDiff0
    } = scopeEvaluator.evalScope(symbols0)

    expect(scope0).toNearlyEqual( { w: 2, z: [1, 1, 1] } )
    expect(sortDiff(scopeDiff0)).toEqual( {
      unchanged: [],
      updated: [],
      added: ['w', 'z'],
      deleted: []
    } )
    expect(sortDiff(errorsDiff0)).toEqual( {
      unchanged: [],
      updated: [],
      added: ['v', 'x', 'y'],
      deleted: []
    } )
    expect(Object.keys(errors0).sort()).toEqual( ['v', 'x', 'y'] )

    const {
      scope: scope1,
      scopeDiff: scopeDiff1,
      errors: errors1,
      errorsDiff: errorsDiff1
    } = scopeEvaluator.evalScope(symbols1)

    expect(scope1).toNearlyEqual( { w: 2, y: 4, z: [2, 1, 1] } )
    expect(sortDiff(scopeDiff1)).toEqual( {
      unchanged: ['w'],
      updated: ['z'],
      added: ['y'],
      deleted: []
    } )
    expect(sortDiff(errorsDiff1)).toEqual( {
      unchanged: ['x'],
      updated: ['v'],
      added: [],
      deleted: ['y']
    } )
    expect(Object.keys(errors1).sort()).toEqual( ['v', 'x'] )

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

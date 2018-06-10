import {
  calculateUsedSymbols,
  getUsedSymbols,
  getNameValidators
 } from './selectors'
import { Parser } from 'utils/mathParsing'
import { isAssignmentLHS } from 'containers/MathObjects/components/MathInput'

describe('calculateUsedSymbols', () => {

  test('gets names of all symbols except symbol with omittedId', () => {
    const parser = new Parser()
    const symbols = {
      id0: { name: 'a' },
      id1: { name: 'b' },
      id2: { name: 'b' },
      id3: { name: 'x_1' },
      id4: { name: 'y_1' },
      id5: { name: 'f(x)' }
    }
    expect(calculateUsedSymbols(parser, symbols, 'id3')).toEqual(
      new Set( ['a', 'b', 'y_1', 'f'] )
    )

  } )

  test('Includes name of omittedId if that name is used by another symbol too', () => {
    const symbols = {
      id0: { name: 'a' },
      id1: { name: 'b' },
      id2: { name: 'b' },
      id3: { name: 'x_1' },
      id4: { name: 'y_1' },
      id5: { name: 'f(x)' }
    }
    const parser = new Parser()
    expect(calculateUsedSymbols(parser, symbols, 'id2')).toEqual(
      new Set( ['a', 'b', 'x_1', 'y_1', 'f'] )
    )

  } )

  test('skips symbol name if symbol causes a parse error', () => {
    const symbols = {
      id0: { name: 'a' },
      id1: { name: 'b' },
      id2: { name: 'b' },
      id3: { name: 'x_1' },
      id4: { name: 'y_1' },
      id5: { name: 'f(x)' },
      id6: { name: 'c+' }
    }
    const parser = new Parser()
    expect(calculateUsedSymbols(parser, symbols, 'id2')).toEqual(
      new Set( ['a', 'b', 'x_1', 'y_1', 'f'] )
    )

  } )
} )

describe('getUsedSymbols', () => {
  const symbols = {
    id0: { name: 'a' },
    id1: { name: 'b' },
    id2: { name: 'b' },
    id3: { name: 'x_1' },
    id4: { name: 'y_1' },
    id5: { name: 'f(x)' },
    id6: { name: 'c+' }
  }

  test('caching behaves as expected', () => {
    const parser = new Parser()
    getUsedSymbols(parser, symbols, 'id1')
    const selector1 = getUsedSymbols.getMatchingSelector(parser, symbols, 'id1')
    expect(selector1.recomputations()).toBe(1)
    getUsedSymbols(parser, symbols, 'id1')
    expect(selector1.recomputations()).toBe(1)
    getUsedSymbols(parser, { ...symbols }, 'id1')
    expect(selector1.recomputations()).toBe(2)
    // cache size is one, so we'll need to re-compute
    getUsedSymbols(parser, symbols, 'id1')
    expect(selector1.recomputations()).toBe(3)

    getUsedSymbols(parser, symbols, 'id2')
    const selector2 = getUsedSymbols.getMatchingSelector(parser, symbols, 'id2')
    expect(selector2.recomputations()).toBe(1)
    getUsedSymbols(parser, symbols, 'id2')
    expect(selector2.recomputations()).toBe(1)
    getUsedSymbols(parser, { ...symbols }, 'id2')
    expect(selector2.recomputations()).toBe(2)
  } )

  test('returned set is deep equal to expected value', () => {
    const parser = new Parser()
    expect(getUsedSymbols(parser, symbols, 'id2')).toEqual(
      new Set( ['a', 'b', 'x_1', 'y_1', 'f'] )
    )
    expect(getUsedSymbols(parser, symbols, 'id3')).toEqual(
      new Set( ['a', 'b', 'y_1', 'f'] )
    )
  } )

} )

describe('getNameValidators', () => {

  test('caching works as expected', () => {
    const parser = new Parser()
    const mathScope = { id0: { name: 'a' } }

    getNameValidators(parser, mathScope, 'id0')
    const selector = getNameValidators.getMatchingSelector(parser, mathScope, 'id0')

    expect(
      getNameValidators(parser, mathScope, 'id0')
    ).toBe(
      getNameValidators(parser, mathScope, 'id0')
    )
    expect(selector.recomputations()).toBe(1)

  } )

  test('Returns the expected result', () => {
    const parser = new Parser()
    const mathScope = { id0: { name: 'a' } }
    const nameValidators = getNameValidators(parser, mathScope, 'id0')
    expect(nameValidators[0] ).toBe(isAssignmentLHS)
    expect(nameValidators[1] ).toEqual(expect.any(Function))
    expect(nameValidators[1] ).toHaveLength(2)
  } )
} )

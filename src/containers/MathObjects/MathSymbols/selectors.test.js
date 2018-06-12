import {
  calculateUsedNames,
  getUsedNames
} from './selectors'
import { Parser } from 'utils/mathParsing'

describe('calculateUsedNames', () => {

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
    expect(calculateUsedNames(parser, symbols, 'id3')).toEqual(
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
    expect(calculateUsedNames(parser, symbols, 'id2')).toEqual(
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
    expect(calculateUsedNames(parser, symbols, 'id2')).toEqual(
      new Set( ['a', 'b', 'x_1', 'y_1', 'f'] )
    )

  } )
} )

describe('getUsedNames', () => {
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
    getUsedNames(parser, symbols, 'id1')
    const selector1 = getUsedNames.getMatchingSelector(parser, symbols, 'id1')
    expect(selector1.recomputations()).toBe(1)
    getUsedNames(parser, symbols, 'id1')
    expect(selector1.recomputations()).toBe(1)
    getUsedNames(parser, { ...symbols }, 'id1')
    expect(selector1.recomputations()).toBe(2)
    // cache size is one, so we'll need to re-compute
    getUsedNames(parser, symbols, 'id1')
    expect(selector1.recomputations()).toBe(3)

    getUsedNames(parser, symbols, 'id2')
    const selector2 = getUsedNames.getMatchingSelector(parser, symbols, 'id2')
    expect(selector2.recomputations()).toBe(1)
    getUsedNames(parser, symbols, 'id2')
    expect(selector2.recomputations()).toBe(1)
    getUsedNames(parser, { ...symbols }, 'id2')
    expect(selector2.recomputations()).toBe(2)
  } )

  test('returned set is deep equal to expected value', () => {
    const parser = new Parser()
    expect(getUsedNames(parser, symbols, 'id2')).toEqual(
      new Set( ['a', 'b', 'x_1', 'y_1', 'f'] )
    )
    expect(getUsedNames(parser, symbols, 'id3')).toEqual(
      new Set( ['a', 'b', 'y_1', 'f'] )
    )
  } )

} )

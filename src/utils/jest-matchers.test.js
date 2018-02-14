import { setToJSON, toEqualAsSet } from './jest-matchers'
expect.extend( { toEqualAsSet } )

describe('setToJSON replacer function for JSON.stringify', () => {
  test('stringifies correctly', () => {
    const setA = new Set( [
      1,
      'cat',
      new Set( ['a', 'b'] ),
      { first: 'Harry', last: 'Skywalker' },
      [3, 4]
    ] )

    expect(
      JSON.stringify(setA, setToJSON)
    ).toEqual(
      '[1,"cat",["a","b"],{"first":"Harry","last":"Skywalker"},[3,4]]'
    )

  } )
} )

describe('toEqualAsSets', () => {

  test('works with flat sets', () => {
    const A = new Set( ['1', 3, 'cat'] )
    const B = new Set( [3, 'cat', '1'] )
    const C = new Set( ['1', 'cat'] )
    const D = new Set( [3, '1', 4, 'cat'] )

    expect(A).toEqualAsSet(B)
    expect(A).not.toEqualAsSet(C)
    expect(A).not.toEqualAsSet(D)

  } )

  test('messages  ', () => {
    const A = new Set( ['1', 3, 'cat'] )
    const B = new Set( [3, 'cat', '1'] )
    const C = new Set( ['1', 'cat'] )

    // Verify messages working:
    const resultPassed = toEqualAsSet(A, B)
    expect(
      resultPassed.message()
    ).toEqual('expected ["1",3,"cat"] to have same elements as [3,"cat","1"]')
    expect(resultPassed.pass).toBe(true)

    // Verify messages working:
    const resultFailed = toEqualAsSet(A, C)
    expect(
      resultFailed.message()
    ).toEqual('expected ["1",3,"cat"] to have same elements as ["1","cat"]')
    expect(resultFailed.pass).toBe(false)
  } )

  test('works with nested sets', () => {
    const A = new Set( ['1', 3, [1, 2], new Set( ['x', 'y'] )] )
    const B = new Set( ['1', 3, [1, 2], new Set( ['y', 'x'] )] )
    const C = new Set( ['1', 3, [2, 1], new Set( ['y', 'x'] )] )

    expect(A).toEqualAsSet(B)
    // TODO: This is seems wrong. Bug reported to lodash.
    expect(A).toEqualAsSet(C)
  } )

} )

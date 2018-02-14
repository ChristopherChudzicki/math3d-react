import { toEqualAsSet } from './jest-matchers'
expect.extend( { toEqualAsSet } )

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

  test('works with nested sets', () => {
    const A = new Set( ['1', 3, [1, 2], new Set( ['x', 'y'] )] )
    const B = new Set( ['1', 3, [1, 2], new Set( ['y', 'x'] )] )
    const C = new Set( ['1', 3, [2, 1], new Set( ['y', 'x'] )] )

    expect(A).toEqualAsSet(B)
    // TODO: This is seems wrong. Bug reported to lodash.
    expect(A).toEqualAsSet(C)
  } )

} )

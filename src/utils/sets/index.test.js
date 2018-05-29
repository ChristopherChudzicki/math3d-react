import {
  union,
  intersect,
  setMergeInto
} from './index'

describe('union', () => {

  const a = new Set( ['cat', 1, 'fish'] )
  const b = new Set( [1, 'whale', 'cat'] )
  const expectedUnion = new Set( ['cat', 1, 'fish', 'whale'] )
  const theUnion = union(a, b)

  test('union contains expected items', () => {
    expect(theUnion).toEqual(expectedUnion)
  } )

  test('inputs were not mutated', () => {
    const expectedA = new Set( ['cat', 1, 'fish'] )
    const expectedB = new Set( [1, 'whale', 'cat'] )
    expect(a).toEqual(expectedA)
    expect(b).toEqual(expectedB)
  } )
} )

describe('intersection', () => {

  const a = new Set( ['cat', 1, 'fish'] )
  const b = new Set( [1, 'whale', 'cat'] )
  const expectedIntersection = new Set( ['cat', 1] )
  const theIntersection = intersect(a, b)

  test('intersection contains expected items', () => {
    expect(theIntersection).toEqual(expectedIntersection)
  } )

  test('inputs were not mutated', () => {
    const expectedA = new Set( ['cat', 1, 'fish'] )
    const expectedB = new Set( [1, 'whale', 'cat'] )
    expect(a).toEqual(expectedA)
    expect(b).toEqual(expectedB)
  } )
} )

describe('setMergeInto', () => {

  const target = new Set( ['cat', 1, 'fish'] )
  const source = new Set( [1, 'whale', 'cat'] )
  const expectedMerge = new Set( ['cat', 1, 'fish', 'whale'] )
  setMergeInto(target, source)

  test('union contains expected items', () => {
    expect(target).toEqual(expectedMerge)
  } )

  test('source was not mutated', () => {
    const expectedSource = new Set( [1, 'whale', 'cat'] )
    expect(source).toEqual(expectedSource)
  } )
} )

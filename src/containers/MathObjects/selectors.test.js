import { getContainingArrayKeys, getParent } from './selectors'

describe('getContainingArrayKeys', () => {

  const objOfArrays = {
    a: [1, 2, 'cat', 2, 'dog', null],
    b: [3, 'dog', 5],
    c: [13, 'horse', 'cat', 19]
  }

  test('finds existing matches', () => {
    const result = getContainingArrayKeys(objOfArrays, 'cat')
    const expected = new Set( ['a', 'c'] )
    expect(result).toEqual(expected)
  } )

  test('returns empty set when no matches found', () => {
    const result = getContainingArrayKeys(objOfArrays, '17')
    const expected = new Set()
    expect(result).toEqual(expected)
  } )

} )

describe('getParent', () => {
  const tree = {
    root: ['folder0', 'folder1', 'folder2', 'folder3'],
    folder0: ['item0', 'item1', 'item2'],
    folder1: ['item3', 'item4', 'item5', 'item6'],
    folder2: ['item7', 'item8'],
    folder3: ['item9', 'item10', 'item11', 'item12', 'item13', 'item15']
  }

  test('returns correct parent', () => {
    const result0 = getParent(tree, 'folder1')
    const expected0 = 'root'
    expect(result0).toEqual(expected0)

    const result1 = getParent(tree, 'item7')
    const expected1 = 'folder2'
    expect(result1).toEqual(expected1)

  } )

} )

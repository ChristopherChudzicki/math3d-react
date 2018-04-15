import { getContainingArrayKeys, getActiveFolder } from './selectors'

describe('getActiveFolder', () => {
  const folders = {
    root: ['folder0', 'folder1', 'folder2', 'folder3'],
    folder0: ['item0', 'item1', 'item2'],
    folder1: ['item3', 'item4', 'item5', 'item6'],
    folder2: ['item7', 'item8'],
    folder3: ['item9', 'item10', 'item11', 'item12', 'item13', 'item15']
  }

  test('returns null if activeObject is null', () => {
    const result = getActiveFolder(folders, null)
    const expected = null
    expect(result).toEqual(expected)
  } )

  test('returns correct folder if activeObject is folder', () => {
    const result = getActiveFolder(folders, 'folder1')
    const expected = 'folder1'
    expect(result).toEqual(expected)
  } )

  test('returns correct folder if activeObject is item in folder', () => {
    const result = getActiveFolder(folders, 'item7')
    const expected = 'folder2'
    expect(result).toEqual(expected)
  } )
} )

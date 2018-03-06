import mathTree, { reOrder } from './reducer'

describe('dragReOrder', () => {
  it('correctly moves an item down the list', () => {
    const initial = ['ant', 'bat', 'cat', 'dog', 'elf', 'frog']
    const sourceIndex = 2
    const destinationIndex = 4
    const expected = ['ant', 'bat', 'dog', 'elf', 'cat', 'frog']
    const reOrdered = reOrder(initial, sourceIndex, destinationIndex)
    expect(reOrdered).toEqual(expected)
  } )

  it('correctly moves an item up the list', () => {

  } )
} )

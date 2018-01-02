import {
  escapeRegExp,
  replaceAll,
  findClosingBrace
}
from './helpers'

test('escaping regular expressions', () => {
  const escaped = escapeRegExp('3 * sin(x)^2')
  expect(escaped).toBe('3 \\* sin\\(x\\)\\^2')
})

describe('replaceAll', () => {

  test('replacing normal characters', () => {
    expect(replaceAll('cat ate the bat', 'at', 'AT'))
      .toBe('cAT ATe the bAT')
  })

  test('replacing special characters', () => {
    expect(replaceAll('diff( diff( f ) ) ( t)', '( ', '('))
      .toBe('diff(diff(f ) ) (t)')
  })

})

describe('findClosingBrace', () => {
  // TODO
})

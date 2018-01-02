import {
  escapeRegExp,
  replaceAll,
  findClosingBrace
}
from './helpers'

test('escaping regular expressions', () => {
  const input = '3 * sin(x)^2'
  const goal  = '3 \\* sin\\(x\\)\\^2'
  expect(escapeRegExp(input)).toBe(goal)
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
  test('finding a closing brace', () => {

    //                  01234567890123456789012345678901234567890123456789
    const expression = '4 + ( sin( 3^(1) - 7^2 ) + 5 ) + exp(8 - (4*3) )'
    const startIdx = 4
    expect(findClosingBrace(expression, startIdx)).toBe(29)

  })

  test('throws an error if no opening brace at specified location', () => {
    //                  0123456789
    const expression = '4 + sin(x)'
    const startIdx = 2
    const badfunc = () =>  findClosingBrace(expression, startIdx)
    expect(badfunc).toThrow(
      `${expression} does not contain an opening brace at position ${startIdx}.`
    )
  })

  test('throws an error if brace opens but does not close', () => {
    //                  012345678901234
    const expression = '4 + sin( e^(2t)'
    const startIdx = 7
    const badfunc = () =>  findClosingBrace(expression, startIdx)
    expect(badfunc).toThrow(
      `${expression} has a brace that opens at position ${startIdx} but does not close.`
    )
  })
})

import {
  escapeRegExp,
  replaceAll,
  findClosingBrace,
  findIntegralEnd
} from './helpers'

test('escaping regular expressions', () => {
  const input = '3 * sin(x)^2'
  const goal = '3 \\* sin\\(x\\)\\^2'
  expect(escapeRegExp(input)).toBe(goal)
} )

describe('replaceAll', () => {
  test('replacing normal characters', () => {
    expect(replaceAll('cat ate the bat', 'at', 'AT'))
      .toBe('cAT ATe the bAT')
  } )

  test('replacing special characters', () => {
    expect(replaceAll('diff( diff( f ) ) ( t)', '( ', '('))
      .toBe('diff(diff(f ) ) (t)')
  } )
} )

describe('findClosingBrace', () => {
  test('finding a closing brace', () => {
    //                  01234567890123456789012345678901234567890123456789
    const expression = '4 + ( sin( 3^(1) - 7^2 ) + 5 ) + exp(8 - (4*3) )'
    const startIdx = 4
    expect(findClosingBrace(expression, startIdx)).toBe(29)
  } )

  test('throws an error if no opening brace at specified location', () => {
    //                  0123456789
    const expression = '4 + sin(x)'
    const startIdx = 2
    const badfunc = () => findClosingBrace(expression, startIdx)
    expect(badfunc).toThrow(
      `${expression} does not contain an opening brace at position ${startIdx}.`
    )
  } )

  test('throws an error if brace opens but does not close', () => {
    //                  012345678901234
    const expression = '4 + sin( e^(2t)'
    const startIdx = 7
    const badfunc = () => findClosingBrace(expression, startIdx)
    expect(badfunc).toThrow(
      `${expression} has a brace that opens at position ${startIdx} but does not close.`
    )
  } )
} )

describe('findIntegralEnd', () => {
  test('simple variable of integration with simple boundary', () => {
    const expression = '10 + \\int_0^1\\int_0^1xdydx'
    const startIdx = 5
    expect(findIntegralEnd(expression, startIdx)).toBe(24)
  } )

  test('skip integration boundary', () => {
    const expression = '\\int_0^ddx'
    const startIdx = 0
    expect(findIntegralEnd(expression, startIdx)).toBe(8)
  } )
  test('implicit integrand', () => {
    const expression = '\\int_0^1\\int_0^1dudv'
    const startIdx = 0
    expect(findIntegralEnd(expression, startIdx)).toBe(18)
  } )
  
  test('symbol variable of integration with symbol boundary', () => {
    const expression = '5 + \\int_0^{\\alpha}2\\int_{\\beta}^1xd\\gammad d\\eta'
    const startIdx = 4
    expect(findIntegralEnd(expression, startIdx)).toBe(44)
  } )

  test('throw an error if starting index is not an integral', () => {
    const expression = '\\int_0^1xdx'
    const startIdx = 6
    const badfunc = () => findIntegralEnd(expression, startIdx)
    expect(badfunc).toThrow(`${expression} does not contain an opening of integral at position ${startIdx}.`)
  } )

  test('throw an error if no differentials', () => {
    const expression = '\\int_0^1x'
    const startIdx = 0
    const badfunc = () => findIntegralEnd(expression, startIdx)
    expect(badfunc).toThrow(`cannot find end of integral.`)
  })
} )

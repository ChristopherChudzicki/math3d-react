import preprocessMathQuill, { fracToDivision } from './preprocessMathQuill'

describe('fracToDivision', () => {
  test('converts zero fractions correctly', () => {
    const input = 'a + b'
    const expected = 'a + b'
    expect(fracToDivision(input)).toBe(expected)
  } )

  test('converts a single fraction correctly', () => {
    const input = '1 + \\frac{1 + \\cos{x}}{1 - \\cos{x}}'
    const expected = '1 + {1 + \\cos{x}}/{1 - \\cos{x}}'
    expect(fracToDivision(input)).toBe(expected)
  } )

  test('converts multiple fractions correctly', () => {
    const input = 'x + \\frac{a + \\frac{b + c}{d - e}}{f + g}'
    const expected = 'x + {a + {b + c}/{d - e}}/{f + g}'
    expect(fracToDivision(input)).toBe(expected)
  } )
} )

describe('preprocessMathQuill', () => {
  test('fractions converted', () => {
    const input = 'a + \\frac{b + \\frac{c+d}{e+f}}{g+h}'
    const expected = 'a + (b + (c+d)/(e+f))/(g+h)'
    expect(preprocessMathQuill(input)).toBe(expected)
  } )

  test('backslashes are removed', () => {
    const input = '1 + 3\\sin{\\pi x}'
    const expected = '1 + 3 sin( pi x)'
    expect(preprocessMathQuill(input)).toBe(expected)
  } )
} )

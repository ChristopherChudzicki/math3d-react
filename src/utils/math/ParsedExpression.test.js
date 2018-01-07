import ParsedExpression from './ParsedExpression'

describe('ParsedExpression', () => {
  test('detects variables and function dependencies', () => {
    const expression = 'f(4x, b*y, g(z)) + sin(t^2) - sqrt(4*B)'
    const variablesUsed = ['B', 't', 'z', 'y', 'b', 'x']
    const functionsUsed = ['f', 'g', 'sin', 'sqrt']
    const parsed = new ParsedExpression(expression)

    expect(parsed.variablesUsed.sort()).toEqual(variablesUsed.sort())
    expect(parsed.functionsUsed.sort()).toEqual(functionsUsed.sort())
  } )

  test('applies preprocessors', () => {
    const preprocessors = [
      str => `${str} + 1`,
      str => `${str} + 1/2`
    ]
    const expression = '0'
    const parsed = new ParsedExpression(expression, { preprocessors } )
    const nDigits = 6
    expect(parsed.parseTree.eval( {} )).toBeCloseTo(1.5, nDigits)
  } )

  // Describe operator replacement & test with evaluation

  // Describe preprocess & test with evaluation

  // Describe error handling
} )

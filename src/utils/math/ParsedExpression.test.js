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

  // Describe operator replacement & test with evaluation

  // Describe preprocess & test with evaluation

  // Describe error handling
} )

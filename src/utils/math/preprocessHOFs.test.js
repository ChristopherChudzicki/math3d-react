import preprocessHOFs, { normalizeHOFExpression } from './preprocessHOFs'

describe('preprocessHOFs', () => {
  test('behaves correctly if no HOFs present', () => {
    const preprocess = preprocessHOFs( ['diff'] )
    const input = 'cos(t)*i + sin(t)*j'
    expect(preprocess(input)).toBe(input)
  })

  test('unnested HOFs are converted correctly', () => {
    const preprocess = preprocessHOFs( ['diff'] )
    const input = 'diff(g)(t) + diff(f)(u,v)'
    const goal = 'diff(g,t) + diff(f,u,v)'
    expect(preprocess(input)).toBe(goal)
  } )

  test('nested HOF is converted correctly', () => {
    test('single HOF is converted correctly', () => {
      const preprocess = preprocessHOFs( ['diff'] )
      const input = 'e^t + diff( diff(r) )(t)'
      const goal = 'e^t + diff(diff(r),t)'
      expect(preprocess(input)).toBe(goal)
    } )
  } )

  test('multiple HOFs are converted correctly', () => {
    const preprocess = preprocessHOFs( ['diff', 'unitT'] )
    const input = 'diff(unitT(r))(t) + unitT(r)(t) + diff(r)(t)'
    const goal = 'diff(unitT(r),t) + unitT(r,t) + diff(r,t)'
    expect(preprocess(input)).toBe(goal)
  } )
} )

describe('hof expression normalization', () => {
  test('simple hof name is replaced correctly', () => {
    const input = 'diff   ( f )  (u, v)'
    const goal = 'diff( f )(u, v)'

    expect(normalizeHOFExpression(input, 'diff')).toBe(goal)
  } )

  test('hof name with special characters is replaced correctly', () => {
    const input = '\\test   ( f )  (u, v)'
    const goal = '\\test( f )(u, v)'

    expect(normalizeHOFExpression(input, '\\test')).toBe(goal)
  } )
} )

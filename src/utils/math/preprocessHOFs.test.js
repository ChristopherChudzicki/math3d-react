import preprocessHOFs from './preprocessHOFs'

describe('preprocessHOFs', () => {

  test('unnested HOFs are converted correctly', () => {
    const preprocess = preprocessHOFs(['diff'])
    expect(preprocess('diff(g)(t) + diff(f)(u,v)'))
      .toBe('diff(g,t)+ diff(f,u,v)')
  })

  test('nested HOF is converted correctly', () => {
    test('single HOF is converted correctly', () => {
      const preprocess = preprocessHOFs(['diff'])
      expect(preprocess('e^t + diff( diff(r) )(t)'))
        .toBe('e^t + diff(diff(r),t)')
    })
  })

  test('multiple HOFs are converted correctly', () => {
    const preprocess = preprocessHOFs(['diff', 'unitT'])
    expect(preprocess('diff(unitT(r))(t) + unitT(r)(t) + diff(r)(t)'))
      .toBe('diff(unitT(r),t)+ unitT(r,t)+ diff(r,t)')
  })
})

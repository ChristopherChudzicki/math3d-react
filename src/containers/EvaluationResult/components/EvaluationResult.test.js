import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import EvaluationResult from './EvaluationResult'
import { Parser } from 'utils/mathParsing'

Enzyme.configure( { adapter: new Adapter() } )

function ChildResult() {
  return <span/>
}
const childFunc = jest.fn(() => <ChildResult/>)
const onCalcError = jest.fn()

function shallowEvaluationResult(props = {} ) {
  const parser = new Parser()
  return shallow(
    <EvaluationResult
      parser={parser}
      onCalcError={onCalcError}
      {...props}
    >
      {childFunc}
    </EvaluationResult>
  )
}

beforeEach(() => {
  jest.clearAllMocks()
} )

describe('EvaluationResult', () => {
  it('passes EvaluationResult to render function', () => {
    const scope = {
      f: t => t**2,
      a: 3,
      b: -2
    }
    const toEvaluate = {
      coords: '[f(3), a+b, 5]',
      min: 'b'
    }
    const expectedResult = {
      coords: [9, 1, 5],
      min: -2
    }

    const wrapper = shallowEvaluationResult( {
      scope,
      toEvaluate
    } )

    expect(wrapper.type()).toEqual(ChildResult)
    expect(childFunc).toHaveBeenCalledTimes(1)
    expect(childFunc).toHaveBeenCalledWith(expectedResult)

  } )

} )

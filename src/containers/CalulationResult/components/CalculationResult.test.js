import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import CalculationResult from './CalculationResult'
import { Parser, ScopeEvaluator } from 'utils/mathParsing'

Enzyme.configure( { adapter: new Adapter() } )

function ChildResult() {
  return <span/>
}
const childFunc = jest.fn(() => <ChildResult/>)
const onSymbolError = jest.fn()
const onCalcError = jest.fn()

function shallowCalculationResult(props = {} ) {
  const parser = new Parser()
  const scopeEvaluator = new ScopeEvaluator(parser)
  return shallow(
    <CalculationResult
      parser={parser}
      scopeEvaluator={scopeEvaluator}
      onSymbolError={onSymbolError}
      onCalcError={onCalcError}
      {...props}
    >
      {childFunc}
    </CalculationResult>
  )
}

beforeEach(() => {
  jest.clearAllMocks()
} )

describe('CalculationResult', () => {
  it('passes calculationResult to render function', () => {
    const symbols = {
      f: 'f(t)=t^2',
      a: 'a=f(4)',
      b: 'b=-4',
      c: 'c=5+w'
    }
    const toCalculate = {
      coords: '[f(2), a+b, 5]',
      min: 'b'
    }
    const expectedResult = {
      coords: [4, 12, 5],
      min: -4
    }

    const wrapper = shallowCalculationResult( {
      symbols,
      toCalculate
    } )

    expect(wrapper.type()).toEqual(ChildResult)
    expect(childFunc).toHaveBeenCalledTimes(1)
    expect(childFunc).toHaveBeenCalledWith(expectedResult)

  } )

} )

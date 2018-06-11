import React from 'react'
import MathInput from './MathInput'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { MathQuillLarge } from './MathQuillStyled'
import { Tooltip } from 'antd'
import { timeout } from 'utils/functions'

Enzyme.configure( { adapter: new Adapter() } )

const DISPLAY_ERROR_DELAY = 50
const validate = jest.spyOn(MathInput, 'validate')
const onErrorChange = jest.spyOn(MathInput.prototype, 'onErrorChange')

beforeEach(() => {
  jest.clearAllMocks()
} )

const shallowMathInput = (props = {} ) => shallow(
  <MathInput
    onTextChange={() => null}
    onErrorChange={() => null}
    field='TEST'
    latex='E=mc^2'
    displayErrorDelay={DISPLAY_ERROR_DELAY}
    validators={[
      (parser, latex) => latex === 'E=mc^2'
        ? { isValid: true }
        : { isValid: false, errorMsg: `errorMsg!` }
    ]}
    {...props}
  />
)

describe('What MathInput renders', () => {

  it('should render one <MathQuillLarge /> component', () => {
    const wrapper = shallowMathInput()
    expect(wrapper.find(MathQuillLarge)).toHaveLength(1)
  } )

  it('should render one <Tooltip /> component', () => {
    const wrapper = shallowMathInput()
    expect(wrapper.find(Tooltip)).toHaveLength(1)
  } )
} )

describe("MathInout's validation function", () => {
  it('should be called during mount', () => {
    shallowMathInput()
    expect(validate).toHaveBeenCalledTimes(1)
  } )

  it('should be called if latex property changes', () => {
    const wrapper = shallowMathInput( { latex: '1+1' } )
    expect(validate).toHaveBeenCalledTimes(1)
    wrapper.setProps( { latex: '1+2' } )
    expect(validate).toHaveBeenCalledTimes(2)
  } )

  it('should be called if validators property changes', () => {
    const wrapper = shallowMathInput()
    expect(validate).toHaveBeenCalledTimes(1)
    wrapper.setProps( { validators: [] } )
    expect(validate).toHaveBeenCalledTimes(2)
  } )

  it('should not be called if props latex and validators stay same', () => {
    const wrapper = shallowMathInput()
    expect(validate).toHaveBeenCalledTimes(1)
    // set some other prop, like 'errorMsg'
    // componentDidUpdate is still called, but needsValidation will be false
    wrapper.setProps( { errorMsg: 'Oh no!' } )
    expect(validate).toHaveBeenCalledTimes(1)
  } )

  it('should call each validator funciton until one fails', () => {
    const validators = [
      jest.fn(() => ( { isValid: true } )),
      jest.fn(() => ( { isValid: false, errorMsg: 'error!' } )),
      jest.fn(() => ( { isValid: true } ))
    ]
    shallowMathInput( { validators } )
    expect(validate).toHaveBeenCalledTimes(1)
    expect(validators[0] ).toHaveBeenCalledTimes(1)
    expect(validators[1] ).toHaveBeenCalledTimes(1)
    expect(validators[2] ).toHaveBeenCalledTimes(0)
  } )
} )

describe("MathInput's basic focus and blur", () => {
  it('should focus as expected', () => {
    const wrapper = shallowMathInput()
    wrapper.instance().onFocus()
    expect(wrapper.state('isFocused')).toBe(true)
  } )

  it('should blur as expected', () => {
    const wrapper = shallowMathInput()
    wrapper.instance().onBlur()
    expect(wrapper.state('isFocused')).toBe(false)
  } )

  it('should pass onFocus to MathQuill', () => {
    const wrapper = shallowMathInput()
    expect(
      wrapper.find(MathQuillLarge).props().onFocus
    ).toBe(
      wrapper.instance().onFocus
    )
  } )

  it('should pass onBlur to MathQuill', () => {
    const wrapper = shallowMathInput()
    expect(
      wrapper.find(MathQuillLarge).props().onBlur
    ).toBe(
      wrapper.instance().onBlur
    )
  } )

} )

describe('MathInput.prototype.onErrorChange', () => {
  it('is called if error message changes', () => {
    const wrapper = shallowMathInput()
    expect(wrapper.instance().props.errorMsg).toBe(undefined)
    expect(onErrorChange).toHaveBeenCalledTimes(0)
    wrapper.setProps( {
      latex: 'E=mc^'
    } )
    expect(onErrorChange).toHaveBeenCalledTimes(1)
  } )

  it('is not called if error message does not change', () => {
    const wrapper = shallowMathInput( {
      latex: 'F=ma',
      errorMsg: 'errorMsg!'
    } )
    // validate is called on mount, but errorMsg doesnt change
    expect(validate).toHaveBeenCalledTimes(1)
    expect(onErrorChange).toHaveBeenCalledTimes(0)
    wrapper.setProps( {
      latex: 'K=mv^2/2^'
    } )
    // validate is called again, since latex changed
    // but errorMsg has not changed
    expect(validate).toHaveBeenCalledTimes(2)
    expect(onErrorChange).toHaveBeenCalledTimes(0)
  } )
} )

describe('MathInput error persistence handling', () => {
  // isErrorPersistent flag is intended to avoid emphemeral errors that occur
  // while typing expressions

  it('waits until new error stop happening before declaring error persistent', async() => {
    const wrapper = shallowMathInput()

    wrapper.instance().onErrorChange('prop', 'errorMsg0')
    expect(wrapper.state('isPersistentError')).toBe(false)
    await timeout(0.9 * DISPLAY_ERROR_DELAY)

    wrapper.instance().onErrorChange('prop', 'errorMsg1')
    expect(wrapper.state('isPersistentError')).toBe(false)
    await timeout(0.9 * DISPLAY_ERROR_DELAY)

    wrapper.instance().onErrorChange('prop', 'errorMsg2')
    expect(wrapper.state('isPersistentError')).toBe(false)
    await timeout(0.9 * DISPLAY_ERROR_DELAY)

    wrapper.instance().onErrorChange('prop', 'errorMsg2')
    expect(wrapper.state('isPersistentError')).toBe(false)
    await timeout(1.1 * DISPLAY_ERROR_DELAY)
    expect(wrapper.state('isPersistentError')).toBe(true)
  } )

  it('immediately marks isPersistentError: false when error is resolved', async() => {
    const wrapper = shallowMathInput()
    wrapper.instance().onErrorChange('prop', 'errorMsg')
    await timeout(1.1 * DISPLAY_ERROR_DELAY)
    expect(wrapper.state('isPersistentError')).toBe(true)

    wrapper.instance().onErrorChange('prop', undefined)
    expect(wrapper.state('isPersistentError')).toBe(false)
  } )

  it('declares error persistent immediately if present upon mounting', () => {
    const wrapper = shallowMathInput( { latex: 'E=mc^3', errorMsg: 'errorMsg' } )
    expect(wrapper.state('isPersistentError')).toBe(true)
  } )

} )

test("MathInput's onEdit calls props.onTexTchange", () => {
  const wrapper = shallowMathInput( {
    onTextChange: jest.fn()
  } )
  const mq = { latex: () => 'testLatex' }
  wrapper.instance().onEdit(mq)
  expect(wrapper.instance().props.onTextChange).toHaveBeenCalledTimes(1)
  expect(wrapper.instance().props.onTextChange).toHaveBeenCalledWith('TEST', 'testLatex')
} )

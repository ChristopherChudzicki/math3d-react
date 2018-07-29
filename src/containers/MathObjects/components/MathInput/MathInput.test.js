import React from 'react'
import MathInput from './MathInput'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { MathQuillLarge } from './MathQuillStyled'
import { Tooltip } from 'antd'
import { timeout } from 'utils/functions'
import { ParseErrorData } from 'services/errors'

Enzyme.configure( { adapter: new Adapter() } )

const DISPLAY_ERROR_DELAY = 50
const validate = jest.spyOn(MathInput, 'validate')
// fake mathquill object
function mq(latex) {
  return { latex: () => latex }
}

beforeEach(() => {
  jest.clearAllMocks()
} )

const onValidatedTextChange = jest.fn()
const onValidatorAndErrorChange = jest.fn()
const field = 'TEST'

const shallowMathInput = (props = {} ) => shallow(
  <MathInput
    onValidatedTextChange={onValidatedTextChange}
    onValidatorAndErrorChange={onValidatorAndErrorChange}
    onTextChange={() => null}
    onErrorChange={() => null}
    field={field}
    latex='E=mc^2'
    displayErrorDelay={DISPLAY_ERROR_DELAY}
    validators={[
      (parser, latex) => latex === 'E=mc^2'
        ? new ParseErrorData(null)
        : new ParseErrorData('errorMsg!')
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

// TODO: Everywhere below, check call arguments of onValidatedTextChange and
// onValidatorAndErrorChange. This should be easy once react-scripts upgrades to
// jest 23, which exposts mock.results

describe("MathInout's validation process", () => {
  it('should call validate during mount', () => {
    shallowMathInput()
    expect(validate).toHaveBeenCalledTimes(1)
  } )

  it('should NOT call onValidatorAndErrorChange during mount if error unchanged', () => {
    shallowMathInput()
    expect(validate).toHaveBeenCalledTimes(1)
    expect(onValidatorAndErrorChange).toHaveBeenCalledTimes(0)
  } )

  it('should call onValidatorAndErrorChange during mount if error', () => {
    shallowMathInput( {
      latex: 'E=mc^3' // invalid
    } )
    expect(validate).toHaveBeenCalledTimes(1)
    expect(onValidatorAndErrorChange).toHaveBeenCalledTimes(1)
  } )

  it('should call onValidatedTextChange during onEdit', () => {
    const wrapper = shallowMathInput( { latex: '1+1' } )
    expect(validate).toHaveBeenCalledTimes(1)
    wrapper.instance().onEdit(mq('1+2'))
    expect(validate).toHaveBeenCalledTimes(2)
    expect(onValidatedTextChange).toHaveBeenCalledTimes(1)
  } )

  it('should call onValidatorAndErrorChange if validators property AND errorMsg changes', () => {
    const wrapper = shallowMathInput( {
      validators: [ () => new ParseErrorData('Error0') ],
      errorMsg: 'Error0'
    } )
    expect(validate).toHaveBeenCalledTimes(1)
    expect(onValidatorAndErrorChange).toHaveBeenCalledTimes(0)
    wrapper.setProps( {
      validators: [ () => new ParseErrorData('Error1') ]
    } )
    expect(validate).toHaveBeenCalledTimes(2)
    expect(onValidatorAndErrorChange).toHaveBeenCalledTimes(1)
  } )

  it('should NOT call onValidatorAndErrorChange if validators property changes but not errorMsg', () => {
    const wrapper = shallowMathInput( {
      validators: [ () => new ParseErrorData('Error0') ],
      errorMsg: 'Error0'
    } )
    expect(validate).toHaveBeenCalledTimes(1)
    expect(onValidatorAndErrorChange).toHaveBeenCalledTimes(0)
    wrapper.setProps( {
      validators: [ () => new ParseErrorData('Error0') ]
    } )
    expect(validate).toHaveBeenCalledTimes(2)
    expect(onValidatorAndErrorChange).toHaveBeenCalledTimes(0)
  } )

  it('should not call onValidatorAndErrorChange if props validators stay same', () => {
    const wrapper = shallowMathInput()
    expect(validate).toHaveBeenCalledTimes(1)
    expect(onValidatorAndErrorChange).toHaveBeenCalledTimes(0)
    // set some other prop, like 'errorMsg'
    // componentDidUpdate is still called, but needsValidation will be false
    wrapper.setProps( { errorMsg: 'Oh no!' } )
    expect(validate).toHaveBeenCalledTimes(1)
    expect(onValidatorAndErrorChange).toHaveBeenCalledTimes(0)
  } )

  it('should call each validator funciton until one fails', () => {
    const validators = [
      jest.fn(() => new ParseErrorData(null)),
      jest.fn(() => new ParseErrorData('error!')),
      jest.fn(() => new ParseErrorData(null))
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

describe('MathInput error persistence handling', () => {
  // isErrorPersistent flag is intended to avoid emphemeral errors that occur
  // while typing expressions

  it('waits until edits stop happening to display error IF originally valid', async() => {
    const wrapper = shallowMathInput()
    expect(wrapper.state('isPersistentError')).toBe(false)

    wrapper.instance().handleErrorPersistence('Error')
    await timeout(0.9 * DISPLAY_ERROR_DELAY)
    expect(wrapper.state('isPersistentError')).toBe(false)

    wrapper.instance().handleErrorPersistence('Error')
    await timeout(0.9 * DISPLAY_ERROR_DELAY)
    expect(wrapper.state('isPersistentError')).toBe(false)

    await timeout(0.2 * DISPLAY_ERROR_DELAY)
    expect(wrapper.state('isPersistentError')).toBe(true)
  } )

  it('immediately hides error when error stops happening', async() => {
    const wrapper = shallowMathInput()
    expect(wrapper.state('isPersistentError')).toBe(false)

    wrapper.instance().handleErrorPersistence('Error')
    await timeout(1.1 * DISPLAY_ERROR_DELAY)
    expect(wrapper.state('isPersistentError')).toBe(true)

    wrapper.instance().handleErrorPersistence(undefined)
    expect(wrapper.state('isPersistentError')).toBe(false)
  } )

  it('declares error persistent immediately if present upon mounting', () => {
    const wrapper = shallowMathInput( { latex: 'E=mc^3', errorMsg: 'errorMsg' } )
    expect(wrapper.state('isPersistentError')).toBe(true)
  } )

} )

test("MathInput's onEdit calls props.onValidatedTextChange", () => {
  const wrapper = shallowMathInput()
  const mq = { latex: () => 'testLatex' }
  const error = new ParseErrorData('errorMsg!')
  wrapper.instance().onEdit(mq)
  expect(wrapper.instance().props.onValidatedTextChange).toHaveBeenCalledTimes(1)
  expect(wrapper.instance().props.onValidatedTextChange).toHaveBeenCalledWith('TEST', 'testLatex', error)
} )

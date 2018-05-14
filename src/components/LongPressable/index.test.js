import React from 'react'
import LongPressable from './index'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// TODO Move this somewhere better, or find it in a library?
/**
 * Creates a Promise that is resolved after delay.
 * Good for using with async/await
 *
 * @param  {number} delay in milliseconds
 */
function timeout(delay) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

Enzyme.configure( { adapter: new Adapter() } )

function renderLongPressable(onShortPress, onLongPress, longPressTime,
  dragThreshold = 5) {
  return shallow(
    <LongPressable
      onShortPress={onShortPress}
      onLongPress={onLongPress}
      longPressTime={longPressTime}
      dragThreshold={dragThreshold}
    />
  )
}

function getDefaultProps() {
  return {
    onLongPress: jest.fn(),
    onShortPress: jest.fn(),
    longPressTime: 300
  }
}

describe('<LongPressable />', () => {

  it('fires onLongPress and not onShortPress when long-pressed', async() => {
    const { onLongPress, onShortPress, longPressTime } = getDefaultProps()
    const defaultEvent = {
      clientX: 0,
      clientY: 0
    }

    const wrapper = renderLongPressable(onShortPress, onLongPress, longPressTime)
    wrapper.instance().onPointerDown(defaultEvent)
    await timeout(longPressTime + 1)
    wrapper.instance().onPointerUp(defaultEvent)
    expect(onShortPress).toHaveBeenCalledTimes(0)
    expect(onLongPress).toHaveBeenCalledTimes(1)
  } )

  it('fires onShortPress and not onLongPress when short-pressed', async() => {
    const { onLongPress, onShortPress, longPressTime } = getDefaultProps()
    const defaultEvent = {
      clientX: 0,
      clientY: 0
    }

    const wrapper = renderLongPressable(onShortPress, onLongPress, longPressTime)
    wrapper.instance().onPointerDown(defaultEvent)
    wrapper.instance().onPointerUp(defaultEvent)
    expect(onShortPress).toHaveBeenCalledTimes(1)
    expect(onLongPress).toHaveBeenCalledTimes(0)
  } )

  it('still fires onLongPress if pointer moves less than dragThreshold', async() => {
    const { onLongPress, onShortPress, longPressTime } = getDefaultProps()
    const dragThreshold = 5
    const defaultEvent = {
      clientX: 0,
      clientY: 0
    }
    const movedEvent = {
      clientX: 1,
      clientY: 1
    }

    const wrapper = renderLongPressable(onShortPress, onLongPress, longPressTime,
      dragThreshold)
    wrapper.instance().onPointerDown(defaultEvent)
    wrapper.instance().onPointerMove(movedEvent)
    await timeout(longPressTime + 1)
    wrapper.instance().onPointerUp(defaultEvent)
    expect(onShortPress).toHaveBeenCalledTimes(0)
    expect(onLongPress).toHaveBeenCalledTimes(1)
  } )

  it('does not fire onLongPress if pointer moves more than dragThreshold', async() => {
    const { onLongPress, onShortPress, longPressTime } = getDefaultProps()
    const dragThreshold = 5
    const defaultEvent = {
      clientX: 0,
      clientY: 0
    }
    const movedEvent = {
      clientX: 100,
      clientY: 100
    }

    const wrapper = renderLongPressable(onShortPress, onLongPress, longPressTime,
      dragThreshold)
    wrapper.instance().onPointerDown(defaultEvent)
    wrapper.instance().onPointerMove(movedEvent)
    await timeout(longPressTime + 1)
    wrapper.instance().onPointerUp(defaultEvent)
    expect(onShortPress).toHaveBeenCalledTimes(1)
    expect(onLongPress).toHaveBeenCalledTimes(0)
  } )

} )

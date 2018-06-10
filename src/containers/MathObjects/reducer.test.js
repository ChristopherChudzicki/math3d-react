import { createReducer } from './reducer'

import {
  SET_PROPERTY,
  TOGGLE_PROPERTY,
  ADD_ERROR,
  REMOVE_ERROR
} from './actions'

describe('setting and toggling properties', () => {

  const state = {
    a0: { species: 'cat', isMammal: true, name: 'fred' },
    a1: { species: 'dragon', isMammal: false, name: 'george' }
  }

  const livingThings = createReducer(new Set( ['ANIMAL', 'PLANTS'] ))

  it('sets properties correctly if name matches', () => {
    const action = {
      type: SET_PROPERTY,
      name: 'ANIMAL',
      payload: {
        id: 'a1',
        property: 'name',
        value: 'ginny'
      }
    }
    const newState = livingThings(state, action)
    const expectedState = {
      a0: { species: 'cat', isMammal: true, name: 'fred' },
      a1: { species: 'dragon', isMammal: false, name: 'ginny' }
    }

    expect(newState).not.toBe(state)
    expect(newState).toEqual(expectedState)
  } )

  it('does not set property if name not match', () => {
    const action = {
      type: SET_PROPERTY,
      name: 'ELEMENTS',
      payload: {
        id: 'helium',
        property: 'atomicMass',
        value: '4'
      }
    }
    const clonedState = JSON.parse(JSON.stringify(state))
    const newState = livingThings(state, action)

    expect(newState).toBe(state)
    expect(newState).toEqual(clonedState)
  } )

  it('toggles properties correctly', () => {
    const action = {
      type: TOGGLE_PROPERTY,
      name: 'ANIMAL',
      payload: {
        id: 'a1',
        property: 'isMammal'
      }
    }
    const newState = livingThings(state, action)
    const expectedState = {
      a0: { species: 'cat', isMammal: true, name: 'fred' },
      a1: { species: 'dragon', isMammal: true, name: 'george' }
    }

    expect(newState).not.toBe(state)
    expect(newState).toEqual(expectedState)
  } )

} )

describe('adding and removing errors', () => {

  const reducer = createReducer(new Set( ['POINT', 'VECTOR'] ))

  const state = {
    a0: {
      color: 'red',
      coords: 'a + b',
      errors: {
        'color': 'ValueError: 27 is not a valid color'
      }
    },
    a1: {
      color: 'blue',
      coords: 'f(t)',
      errors: {}
    },
    a3: {
      color: 'orange',
      components: 'v(t',
      tail: 'r(t',
      size: 's+',
      errors: {
        tail: 'Parse Error: tail',
        components: 'Parse Error: components'
      }
    }
  }

  test('adding error to an object without any errors already', () => {
    const action = {
      type: ADD_ERROR,
      name: 'POINT',
      payload: {
        id: 'a1',
        errorProp: 'coords',
        errorMsg: 'ParseError: cannot parse a + b +'
      }
    }
    const expectedState = {
      a0: {
        color: 'red',
        coords: 'a + b',
        errors: {
          'color': 'ValueError: 27 is not a valid color'
        }
      },
      a1: {
        color: 'blue',
        coords: 'f(t)',
        errors: {
          coords: 'ParseError: cannot parse a + b +'
        }
      },
      a3: {
        color: 'orange',
        components: 'v(t',
        tail: 'r(t',
        size: 's+',
        errors: {
          tail: 'Parse Error: tail',
          components: 'Parse Error: components'
        }
      }
    }
    const newState = reducer(state, action)
    expect(newState).not.toBe(state)
    expect(newState).toEqual(expectedState)
  } )

  test('adding error to an object with errors already', () => {
    const action = {
      type: ADD_ERROR,
      name: 'POINT',
      payload: {
        id: 'a3',
        errorProp: 'size',
        errorMsg: 'Parse Error: size'
      }
    }
    const expectedState = {
      a0: {
        color: 'red',
        coords: 'a + b',
        errors: {
          'color': 'ValueError: 27 is not a valid color'
        }
      },
      a1: {
        color: 'blue',
        coords: 'f(t)',
        errors: {}
      },
      a3: {
        color: 'orange',
        components: 'v(t',
        tail: 'r(t',
        size: 's+',
        errors: {
          tail: 'Parse Error: tail',
          components: 'Parse Error: components',
          size: 'Parse Error: size'
        }
      }
    }
    const newState = reducer(state, action)
    expect(newState).not.toBe(state)
    expect(newState).toEqual(expectedState)
  } )

  test('removing error from object with exactly 1 error', () => {
    const action = {
      type: REMOVE_ERROR,
      name: 'POINT',
      payload: {
        id: 'a0',
        errorProp: 'color'
      }
    }
    const expectedState = {
      a0: {
        color: 'red',
        coords: 'a + b',
        errors: {}
      },
      a1: {
        color: 'blue',
        coords: 'f(t)',
        errors: {}
      },
      a3: {
        color: 'orange',
        components: 'v(t',
        tail: 'r(t',
        size: 's+',
        errors: {
          tail: 'Parse Error: tail',
          components: 'Parse Error: components'
        }
      }
    }

    const newState = reducer(state, action)
    expect(newState).not.toBe(state)
    expect(newState).toEqual(expectedState)

  } )

  test('removing error from object with multiple errors', () => {
    const action = {
      type: REMOVE_ERROR,
      name: 'POINT',
      payload: {
        id: 'a3',
        errorProp: 'tail'
      }
    }
    const expectedState = {
      a0: {
        color: 'red',
        coords: 'a + b',
        errors: {
          'color': 'ValueError: 27 is not a valid color'
        }
      },
      a1: {
        color: 'blue',
        coords: 'f(t)',
        errors: {}
      },
      a3: {
        color: 'orange',
        components: 'v(t',
        tail: 'r(t',
        size: 's+',
        errors: {
          components: 'Parse Error: components'
        }
      }
    }

    const newState = reducer(state, action)
    expect(newState).not.toBe(state)
    expect(newState).toEqual(expectedState)

  } )

} )

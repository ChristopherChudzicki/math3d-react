import { createReducer } from './reducer'

import {
  SET_PROPERTY,
  TOGGLE_PROPERTY
} from './actions'

describe("createReducer's created reducer", () => {

  const state = {
    a0: { species: 'cat', isMammal: true, name: 'fred' },
    a1: { species: 'dragon', isMammal: false, name: 'george' }
  }

  const animals = createReducer('ANIMAL')

  it('sets properties correctly', () => {
    const action = {
      type: SET_PROPERTY,
      name: 'ANIMAL',
      payload: {
        id: 'a1',
        property: 'name',
        value: 'ginny'
      }
    }
    const newState = animals(state, action)
    const expectedState = {
      a0: { species: 'cat', isMammal: true, name: 'fred' },
      a1: { species: 'dragon', isMammal: false, name: 'ginny' }
    }

    expect(newState).not.toBe(state)
    expect(newState).toEqual(expectedState)
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
    const newState = animals(state, action)
    const expectedState = {
      a0: { species: 'cat', isMammal: true, name: 'fred' },
      a1: { species: 'dragon', isMammal: true, name: 'george' }
    }

    expect(newState).not.toBe(state)
    expect(newState).toEqual(expectedState)
  } )

} )

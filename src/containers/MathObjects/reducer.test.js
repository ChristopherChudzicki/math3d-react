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

import deepEqual from 'deep-equal';

export function hasMeaningfulChangeOccured(newState, oldState) {
  const exemptKeys = new Set([
    'drawers',
    'tabs',
    'sliderValues',
    'lastSavedState',
    'activeObject'
  ]);
  return Object.keys(newState)
    .filter(key => !exemptKeys.has(key))
    .some(key => {
      const oldValue = oldState[key]
      const newValue = newState[key]
      return !deepEqual(newValue, oldValue)
    })
}
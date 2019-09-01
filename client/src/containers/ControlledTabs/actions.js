export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB'

export function setActiveTab(id, activeTab) {
  return {
    type: SET_ACTIVE_TAB,
    payload: { activeTab, id }
  }
}

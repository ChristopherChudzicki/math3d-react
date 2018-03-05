export const TOGGLE_CONTENT_COLLAPSED = 'TOGGLE_CONTENT_COLLAPSED'

export const toggleContentCollapsed = (id) => ( {
  type: TOGGLE_CONTENT_COLLAPSED,
  payload: { id }
} )

import {
  toggleProperty,
  setProperty
} from 'containers/MathObjects/actions'

export const FOLDER = 'FOLDER'

export const toggleContentCollapsed = (id) => {
  return toggleProperty(id, FOLDER, 'isCollapsed')
}

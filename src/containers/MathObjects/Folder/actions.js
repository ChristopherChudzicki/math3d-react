import {
  toggleProperty,
  setProperty
} from 'containers/MathObjects/actions'

export const FOLDER = 'FOLDER'

export const toggleFolderContent = (id) => {
  return toggleProperty(id, FOLDER, 'isCollapsed')
}

export const setFolderDescription = (id, value) => {
  return setProperty(id, FOLDER, 'description', value)
}

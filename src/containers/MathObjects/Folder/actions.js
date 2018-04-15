import {
  toggleProperty,
  setProperty,
  createMathObject
} from 'containers/MathObjects/actions'
import { FOLDER } from 'containers/MathObjects/mathObjectTypes'

export const setContentCollapsed = (id, value) => {
  return setProperty(id, FOLDER, 'isCollapsed', value)
}

export const toggleContentCollapsed = (id) => {
  return toggleProperty(id, FOLDER, 'isCollapsed')
}

export const createFolder = (id, positionInFolder) => {
  const parentFolderId = 'root'
  const settings = { description: 'Folder' }
  return createMathObject(id, FOLDER, parentFolderId, positionInFolder, settings)
}

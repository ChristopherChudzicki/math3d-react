import {
  toggleProperty,
  setProperty,
  createMathObject
} from 'containers/MathObjects/actions'
import { FOLDER, defaultSettings } from './metadata'

export const setContentCollapsed = (id, value) => {
  return setProperty(id, FOLDER, 'isCollapsed', value)
}

export const toggleContentCollapsed = (id) => {
  return toggleProperty(id, FOLDER, 'isCollapsed')
}

export const createFolder = (id, positionInFolder) => {
  const parentFolderId = 'root'
  return createMathObject(id, FOLDER, parentFolderId, positionInFolder, defaultSettings)
}

import { getParent } from 'containers/MathObjects/selectors'

const FORBIDDEN_INSERT_FOLDERS = new Set( [
  'axes',
  'cameraFolder'
] )

/**
 * gets the folder corresponding to activeObject, which is:
 * - the id of the folder containing activeObject if activeObject
 * - null if activeObject is null
 *
 * @param  {Object} tree maps folderIds to objectIds
 * @param  {?string} activeObject id of activeObject
 * @return {?string} string of folder corresponding to activeObject
 */
export function getActiveFolder(tree, activeObject) {
  if (activeObject === null) {
    return null
  }
  if (tree[activeObject] ) {
    return FORBIDDEN_INSERT_FOLDERS.has(activeObject) ? null : activeObject
  }
  // getParent will throw an error if no parent or multiple parents
  const parent = getParent(tree, activeObject)

  return FORBIDDEN_INSERT_FOLDERS.has(parent) ? null : parent
}

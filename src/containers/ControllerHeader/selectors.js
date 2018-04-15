import { getParent } from 'containers/MathObjects/selectors'
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
    return activeObject
  }
  // getParent will throw an error if no parent or multiple parents
  return getParent(tree, activeObject)
}

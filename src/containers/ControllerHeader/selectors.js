/**
 * Given an item and an object of arrays, return keys of arrays containing item
 *
 * @param  {object} objOfArrays  maps keys to arrays
 * @param  {[type]} item anything
 * @return {set} set of strings
 */
export function getContainingArrayKeys(objOfArrays, item) {
  const initial = new Set()
  return Object.keys(objOfArrays).reduce((acc, key) => {
    if (objOfArrays[key].includes(item)) {
      acc.add(key)
    }
    return acc
  }, initial)
}

/**
 * gets the folder corresponding to activeObject, which is:
 * - the same as activeObject if activeObject is a folderId
 * - the id of the folder containing activeObject if activeObject is not folder
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
  const parentFolders = getContainingArrayKeys(tree, activeObject)
  // I'm not really sure I need to validate my redux state in this way ...
  if (parentFolders.size < 1) {
    throw Error(`${activeObject} does not have a parent folder`)
  }
  else if (parentFolders.size > 1) {
    throw Error(`${activeObject} has multiple parent folders`)
  }
  return Array.from(parentFolders)[0]
}

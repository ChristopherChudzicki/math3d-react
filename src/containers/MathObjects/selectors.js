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
 * gets id of node's parent
 *
 * @param  {Object} tree maps node to arrayOfNodes
 * @param  {string} nodeName id of activeObject
 * @return {string} string of folder corresponding to activeObject
 */
export function getParent(tree, nodeId) {

  const parentFolders = getContainingArrayKeys(tree, nodeId)
  // I'm not really sure I need to validate my redux state in this way ...
  if (parentFolders.size < 1) {
    throw Error(`${nodeId} does not have parent`)
  }
  else if (parentFolders.size > 1) {
    throw Error(`${nodeId} has multiple parents`)
  }
  return Array.from(parentFolders)[0]
}

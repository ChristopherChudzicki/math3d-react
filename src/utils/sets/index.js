/**
 * Set union
 *
 * @param  {set} a
 * @param  {set} b
 * @return {set}   union of a and b
 */
export function union(a, b) {
  return new Set( [...a, ...b] )
}

/**
 * Set intersection
 *
 * @param  {set} a
 * @param  {set} b
 * @return {set}   union of a and b
 */
export function intersect(a, b) {
  return new Set( [...a].filter(item => b.has(item)))
}

/**
 * merge one set into another
 *
 * @param {set} target target set, mutated and returned
 * @param {set} source whose elements are merged into target
 */
export function setMergeInto(target, source) {
  for (const item of source) {
    target.add(item)
  }
  return target
}

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

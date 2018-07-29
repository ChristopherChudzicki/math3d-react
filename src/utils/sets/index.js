// @flow
/**
 * Set union
 *
 * @param  {set} a
 * @param  {set} b
 * @return {set}   union of a and b
 */
export function union<A, B>(a: Set<A>, b: Set<B>): Set<A|B> {
  return new Set( [...a, ...b] )
}

/**
 * Set intersection
 *
 * @param  {set} a
 * @param  {set} b
 * @return {set}   union of a and b
 */
export function intersect<A>(a: Set<A>, b: Set<A>): Set<A> {
  return new Set( [...a].filter(item => b.has(item)))
}

/**
 * merge one set into another
 *
 * @param {set} target target set, mutated and returned
 * @param {set} source whose elements are merged into target
 */
export function setMergeInto<A, B>(target: Set<A|B>, source: Set<B>): Set<A|B> {
  for (const item of source) {
    target.add(item)
  }
  return target
}

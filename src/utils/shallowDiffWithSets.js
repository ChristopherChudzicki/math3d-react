// @flow
import diff from 'shallow-diff'
// TODO Use this version everywhere, or fork original shallow-diff and make the
// change there.
export default function diffWithSets(base: Object, compared: Object) {
  const difference = diff(base, compared)
  return Object.keys(difference).reduce((acc, key) => {
    acc[key] = new Set(difference[key] )
    return acc
  }, {} )
}

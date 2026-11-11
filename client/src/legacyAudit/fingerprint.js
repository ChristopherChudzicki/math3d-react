/**
 * Reduces an evaluated value to JSON. A port of math3d-next's
 * packages/legacy-audit/src/fingerprint.ts; the format is in math3d-next's
 * docs/legacy-audit/2026-10-29-pass2-spec.md ("Fingerprints"). Both ports must
 * pass fingerprint_cases.json (fingerprint.audit.js).
 *
 * Matrices and complex numbers are recognised by mathjs's `isMatrix` /
 * `isComplex` prototype flags, which mathjs 3.20 already sets.
 */
const MAX_DEPTH = 2
const NESTED_POINTS = 4

const isError = fp => typeof fp === 'object' && fp !== null && 'error' in fp

const number = x => {
  if (Number.isFinite(x)) return x
  if (Number.isNaN(x)) return { nonfinite: 'NaN' }
  return { nonfinite: x > 0 ? 'Infinity' : '-Infinity' }
}

/**
 * @param {Object<string, number[][]>} points sample_points.json: points per arity
 */
export default function makeFingerprint(points) {
  const call = (f, args, depth) => {
    try {
      return fingerprint(f(...args), depth + 1)
    }
    catch (error) {
      return { error: true }
    }
  }

  const sampleFunction = (f, depth) => {
    const arity = f.length
    const atArity = points[String(arity)]
    if (!atArity || depth >= MAX_DEPTH) return { fn: arity, at: null }
    const used = depth === 0 ? atArity : atArity.slice(0, NESTED_POINTS)
    const at = used.map(p => call(f, p, depth))
    if (arity === 0 || !at.every(isError)) return { fn: arity, at }
    const withVectors = length => used.map((_p, j) => call(
      f,
      Array.from(
        { length: arity },
        // A copy: index assignment mutates an array in place.
        (_a, i) => [...points[length][(j + i) % points[length].length]]
      ),
      depth
    ))
    return { fn: arity, at, vec: { 2: withVectors(2), 3: withVectors(3) } }
  }

  function fingerprint(value, depth = 0) {
    if (typeof value === 'number') return number(value)
    if (typeof value === 'boolean') return { bool: value }
    if (typeof value === 'string') return { str: value }
    if (value === undefined) return { undefined: true }
    if (typeof value === 'function') return sampleFunction(value, depth)
    if (Array.isArray(value)) return value.map(v => fingerprint(v, depth))
    if (value === null) return { other: 'null' }
    if (typeof value === 'object') {
      if (value.isMatrix && value.toArray) return fingerprint(value.toArray(), depth)
      if (value.isComplex) return { re: number(value.re), im: number(value.im) }
    }
    const { constructor } = value
    return { other: constructor && constructor.name ? constructor.name : typeof value }
  }

  return fingerprint
}

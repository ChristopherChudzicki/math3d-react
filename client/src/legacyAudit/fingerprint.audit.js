/**
 * Conformance check: this app's fingerprints of math3d-next's
 * fingerprint_cases.json match the fingerprints recorded there, so the two
 * ports of fingerprint agree. See README.md in this folder.
 *
 * Env (absolute paths):
 *   LEGACY_SAMPLE_POINTS      math3d-next packages/legacy-audit/sample_points.json
 *   LEGACY_FINGERPRINT_CASES  math3d-next packages/legacy-audit/fingerprint_cases.json
 */
import fs from 'fs'
import { Parser } from 'utils/mathParsing'
import makeFingerprint from './fingerprint'

const { LEGACY_SAMPLE_POINTS, LEGACY_FINGERPRINT_CASES } = process.env
const readJson = path => JSON.parse(fs.readFileSync(path, 'utf8'))

// Floats may differ in the last bits between the apps' mathjs versions.
const near = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) <= 1e-12 * Math.max(1, Math.abs(a), Math.abs(b))
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((x, i) => near(x, b[i] ))
  }
  if (typeof a === 'object' && typeof b === 'object' && a && b) {
    const keys = Object.keys(a)
    return keys.length === Object.keys(b).length &&
      keys.every(k => near(a[k], b[k] ))
  }
  return a === b
}

const run = LEGACY_SAMPLE_POINTS && LEGACY_FINGERPRINT_CASES ? describe : describe.skip

run('fingerprint_cases.json', () => {
  const fingerprint = makeFingerprint(readJson(LEGACY_SAMPLE_POINTS))
  const cases = readJson(LEGACY_FINGERPRINT_CASES)

  cases.forEach( ( { latex, fingerprint: expected } ) => {
    test(latex, () => {
      const value = new Parser().parse(latex).eval( {} )
      const actual = fingerprint(value)
      if (!near(actual, expected)) {
        // toEqual's diff shows where they disagree
        expect(actual).toEqual(expected)
      }
    } )
  } )
} )

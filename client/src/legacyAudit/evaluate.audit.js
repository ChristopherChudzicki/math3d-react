/**
 * Legacy-scene migration audit, pass 2b: evaluate every rehydrated scene the
 * way this app does on page load (math3d-next
 * docs/legacy-audit/2026-10-29-pass2-spec.md, "2b: math3d-react evaluator").
 *
 * This re-implements MathBoxScene.render's evaluation rather than importing
 * it: MathBoxScene.js builds a MathBox at module load.
 *
 * Env (absolute paths, since Jest's cwd is client/):
 *   LEGACY_EVAL_IN            rehydrated.jsonl from rehydrate.audit.js
 *   LEGACY_EVAL_OUT           JSONL written here, one line per input line, same order
 *   LEGACY_SAMPLE_POINTS      math3d-next packages/legacy-audit/sample_points.json
 *   LEGACY_EVAL_LIMIT         optional: stop after this many scenes
 */
import fs from 'fs'
import readline from 'readline'
import { MathGraphics, VARIABLE_SLIDER } from 'containers/MathObjects'
import { getParseableSymbols } from 'containers/MathScopeContext/selectors'
import { Parser } from 'utils/mathParsing'
import { evalScope } from 'utils/mathParsing/mathscope'
import { evalData } from 'services/evalData'
import makeFingerprint from './fingerprint'

const ONE_HOUR = 60 * 60 * 1000

const fieldId = (id, field) => `${id}-${field}`

function depsOf(parser, expr, idsByName) {
  try {
    return [...parser.parse(expr).dependencies]
      .filter(name => idsByName[name] !== undefined)
      .map(name => fieldId(idsByName[name], 'value'))
  }
  catch (error) {
    return []
  }
}

function evaluateSymbols(parser, scene, fingerprint, out) {
  const { mathSymbols } = scene
  const sliderValues = scene.sliderValues || {}
  const { symbols, idsByName } = getParseableSymbols(parser, mathSymbols, sliderValues)
  const { scope, errors } = evalScope(parser, symbols)
  const nameOf = Object.keys(idsByName).reduce((acc, name) => {
    acc[idsByName[name]] = name
    return acc
  }, {} )

  Object.keys(mathSymbols).forEach(id => {
    const name = nameOf[id]
    const result = {}
    if (name === undefined) {
      // getParseableSymbols dropped it: unparseable, or a duplicate name.
      const { name: lhs, value, type } = mathSymbols[id]
      const expr = (value === null && type === VARIABLE_SLIDER)
        ? `${lhs}=${sliderValues[id]}`
        : `${lhs}=${value}`
      try {
        const parsedName = parser.parse(expr).name
        result.status = 'eval'
        result.message = `Duplicate symbol name ${parsedName}`
        result.deps = depsOf(parser, expr, idsByName)
      }
      catch (error) {
        result.status = 'parse'
        result.message = error.message
        result.deps = []
      }
    }
    else {
      result.deps = depsOf(parser, symbols[name], idsByName)
      if (errors[name] ) {
        result.status = 'eval'
        result.message = errors[name].message
      }
      else {
        result.status = 'ok'
        result.value = fingerprint(scope[name] )
      }
    }
    out[id] = { value: result }
  } )

  return { scope, idsByName }
}

// EvaluatedSlider's checks on its evaluated min and max.
function evaluateSliderRange(parser, symbol, scope, idsByName, fingerprint) {
  const fields = { min: symbol.min, max: symbol.max }
  const { evaluated, evalErrors, parseErrors } = evalData(parser, fields, scope)
  const results = {}
  Object.keys(fields).forEach(prop => {
    const deps = depsOf(parser, fields[prop], idsByName)
    if (parseErrors[prop] ) {
      results[prop] = { status: 'parse', message: parseErrors[prop].message, deps }
    }
    else if (evalErrors[prop] ) {
      results[prop] = { status: 'eval', message: evalErrors[prop].message, deps }
    }
    else if (typeof evaluated[prop] !== 'number') {
      results[prop] = {
        status: 'validate',
        message: `'${prop}' must be a number.`,
        deps,
        value: fingerprint(evaluated[prop] )
      }
    }
    else {
      results[prop] = { status: 'ok', deps, value: fingerprint(evaluated[prop] ) }
    }
  } )
  const { min, max } = results
  if (min.status === 'ok' && max.status === 'ok' && evaluated.min >= evaluated.max) {
    [min, max].forEach(r => {
      r.status = 'validate'
      r.message = `Range Error: 'min' (${evaluated.min}) must be less than 'max' (${evaluated.max})`
    } )
  }
  // A fingerprint is reported only for ok fields.
  Object.values(results).forEach(r => r.status === 'ok' || delete r.value)
  return results
}

function evaluateGraphic(parser, settings, scope, idsByName, fingerprint) {
  const { computedProps } = MathGraphics[settings.type]
  const toEvaluate = computedProps.reduce((acc, prop) => {
    acc[prop] = settings[prop]
    return acc
  }, {} )
  const { evaluated, evalErrors, parseErrors } = evalData(parser, toEvaluate, scope)
  return computedProps.reduce((acc, prop) => {
    const raw = settings[prop]
    if (typeof raw !== 'string') {
      // evalData can't parse it; MathBox receives the setting as is.
      acc[prop] = { status: 'ok', deps: [], value: fingerprint(raw) }
      return acc
    }
    const deps = depsOf(parser, raw, idsByName)
    if (parseErrors[prop] ) {
      acc[prop] = { status: 'parse', message: parseErrors[prop].message, deps }
    }
    else if (evalErrors[prop] ) {
      acc[prop] = { status: 'eval', message: evalErrors[prop].message, deps }
    }
    else {
      acc[prop] = { status: 'ok', deps, value: fingerprint(evaluated[prop] ) }
    }
    return acc
  }, {} )
}

export function evaluateScene(scene, fingerprint) {
  // A fresh Parser per scene: Parser caches each expression, and
  // MathExpression memoizes its eval.
  const parser = new Parser()
  const items = {}
  const { scope, idsByName } = evaluateSymbols(parser, scene, fingerprint, items)
  Object.keys(scene.mathSymbols).forEach(id => {
    const symbol = scene.mathSymbols[id]
    if (symbol.type === VARIABLE_SLIDER) {
      Object.assign(
        items[id],
        evaluateSliderRange(parser, symbol, scope, idsByName, fingerprint)
      )
    }
  } )
  Object.keys(scene.mathGraphics).forEach(id => {
    items[id] = evaluateGraphic(parser, scene.mathGraphics[id], scope, idsByName, fingerprint)
  } )
  return items
}

function evaluateLine(line, fingerprint) {
  const scene = JSON.parse(line)
  const { key } = scene
  if (!scene.mathGraphics) {
    return { key, crashed: `legacy_broken: ${scene.legacy_broken.join('; ')}`, items: {} }
  }
  try {
    return { key, crashed: null, items: evaluateScene(scene, fingerprint) }
  }
  catch (error) {
    return { key, crashed: error.message, items: {} }
  }
}

async function evaluateFile(inPath, outPath, fingerprint, limit) {
  const out = fs.openSync(outPath, 'w')
  const lines = readline.createInterface( {
    input: fs.createReadStream(inPath),
    crlfDelay: Infinity
  } )
  const start = Date.now()
  const elapsed = () => ((Date.now() - start) / 1000).toFixed(0)
  let count = 0
  let crashes = 0
  for await (const line of lines) {
    if (count >= limit) break
    if (!line) continue
    const record = evaluateLine(line, fingerprint)
    if (record.crashed) crashes += 1
    fs.writeSync(out, JSON.stringify( { version: 2, ...record } ) + '\n')
    count += 1
    if (count % 1000 === 0) process.stderr.write(`${count} scenes, ${elapsed()}s\n`)
  }
  lines.close()
  fs.closeSync(out)
  process.stderr.write(`done: ${count} scenes, ${crashes} crashed, ${elapsed()}s\n`)
  return count
}

const { LEGACY_EVAL_IN, LEGACY_EVAL_OUT, LEGACY_SAMPLE_POINTS, LEGACY_EVAL_LIMIT } = process.env
const run = LEGACY_EVAL_IN && LEGACY_EVAL_OUT && LEGACY_SAMPLE_POINTS ? test : test.skip

run('legacy audit: evaluate', async () => {
  const points = JSON.parse(fs.readFileSync(LEGACY_SAMPLE_POINTS, 'utf8'))
  const limit = LEGACY_EVAL_LIMIT ? Number(LEGACY_EVAL_LIMIT) : Infinity
  const count = await evaluateFile(LEGACY_EVAL_IN, LEGACY_EVAL_OUT, makeFingerprint(points), limit)
  expect(count).toBeGreaterThan(0)
}, 4 * ONE_HOUR)

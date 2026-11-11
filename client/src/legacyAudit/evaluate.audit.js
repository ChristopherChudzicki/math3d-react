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
import EvaluatedSlider from 'containers/MathObjects/MathSymbols/VariableSlider/components/EvaluatedSlider'
import VariableSlider from 'containers/MathObjects/MathSymbols/VariableSlider/components/VariableSlider'
import makeFingerprint from './fingerprint'

const ONE_HOUR = 60 * 60 * 1000

const fieldId = (id, field) => `${id}-${field}`

// getParseableSymbols's text for a symbol.
const symbolExpr = ( { name, value, type }, sliderValue) => (
  value === null && type === VARIABLE_SLIDER
    ? `${name}=${sliderValue}`
    : `${name}=${value}`
)

// Every symbol's name, including those getParseableSymbols drops, so that
// deps also point at a duplicate or unparseable symbol.
function allIdsByName(parser, mathSymbols, sliderValues) {
  const nameOf = (symbol, id) => {
    try {
      return parser.parse(symbolExpr(symbol, sliderValues[id] )).name
    }
    catch (error) {
      try {
        return parser.parse(`${symbol.name}=0`).name
      }
      catch (lhsError) {
        return symbol.name
      }
    }
  }
  return Object.keys(mathSymbols).reduce((acc, id) => {
    const name = nameOf(mathSymbols[id], id)
    acc[name] = [...(acc[name] || [] ), id]
    return acc
  }, {} )
}

function depsOf(parser, expr, idsByName) {
  try {
    return [...parser.parse(expr).dependencies]
      .filter(name => idsByName[name] !== undefined)
      .reduce((acc, name) => [...acc, ...idsByName[name].map(id => fieldId(id, 'value'))], [] )
  }
  catch (error) {
    return []
  }
}

function evaluateSymbols(parser, scene, sliderValues, fingerprint, out) {
  const { mathSymbols } = scene
  const { symbols, idsByName: keptIds } = getParseableSymbols(parser, mathSymbols, sliderValues)
  const { scope, errors } = evalScope(parser, symbols)
  const idsByName = allIdsByName(parser, mathSymbols, sliderValues)
  const nameOf = Object.keys(keptIds).reduce((acc, name) => {
    acc[keptIds[name]] = name
    return acc
  }, {} )

  Object.keys(mathSymbols).forEach(id => {
    const name = nameOf[id]
    const result = {}
    if (name === undefined) {
      // getParseableSymbols dropped it: unparseable, or a duplicate name.
      const expr = symbolExpr(mathSymbols[id], sliderValues[id] )
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

/**
 * A slider's min and max, with the errors EvaluatedSlider reports on its first
 * render. Those include range errors against its initial state (-10 to -10)
 * when one bound fails, and a `value` that isn't a number. Parse errors are
 * the input fields' own.
 */
function evaluateSlider(parser, id, symbol, sliderValue, scope, idsByName, fingerprint, item) {
  const fields = { min: symbol.min, max: symbol.max }
  const { evaluated, evalErrors, parseErrors } = evalData(parser, fields, scope)
  const reported = {}
  EvaluatedSlider.getDerivedStateFromProps( {
    parser,
    parentId: id,
    scope,
    ownEvalErrors: {},
    setError: (_id, prop, errorData) => { reported[prop] = errorData.errorMsg },
    ...fields,
    value: VariableSlider.getLaTeX(symbol.value, sliderValue)
  }, { min: -10, max: -10, value: 0 } )

  Object.keys(fields).forEach(prop => {
    const deps = depsOf(parser, fields[prop], idsByName)
    if (parseErrors[prop] ) {
      item[prop] = { status: 'parse', message: parseErrors[prop].message, deps }
    }
    else if (reported[prop] ) {
      item[prop] = { status: evalErrors[prop] ? 'eval' : 'validate', message: reported[prop], deps }
    }
    else {
      item[prop] = { status: 'ok', deps, value: fingerprint(evaluated[prop] ) }
    }
  } )
  if (item.value.status === 'ok' && reported.value) {
    item.value.status = 'validate'
    item.value.message = reported.value
    delete item.value.value
  }
}

function evaluateGraphic(parser, settings, scope, idsByName, fingerprint) {
  const { computedProps } = MathGraphics[settings.type]
  // Parser caches a non-string's parse error under its string form, so only
  // strings go to evalData.
  const toEvaluate = computedProps
    .filter(prop => typeof settings[prop] === 'string')
    .reduce((acc, prop) => {
      acc[prop] = settings[prop]
      return acc
    }, {} )
  const { evaluated, evalErrors, parseErrors } = evalData(parser, toEvaluate, scope)
  return computedProps.reduce((acc, prop) => {
    const raw = settings[prop]
    if (typeof raw !== 'string') {
      // MathBox receives the setting as is.
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
  const { mathSymbols, mathGraphics, sliderValues } = scene
  const sliderIds = Object.keys(mathSymbols).filter(id => mathSymbols[id].type === VARIABLE_SLIDER)
  if (sliderIds.length > 0 && !sliderValues) {
    // VariableSlider's mapStateToProps reads sliderValues[id].
    throw Error('A scene with sliders has no sliderValues')
  }
  // A fresh Parser per scene: Parser caches each expression, and
  // MathExpression memoizes its eval.
  const parser = new Parser()
  const items = {}
  const { scope, idsByName } = evaluateSymbols(parser, scene, sliderValues || {}, fingerprint, items)
  sliderIds.forEach(id => {
    evaluateSlider(parser, id, mathSymbols[id], sliderValues[id], scope, idsByName, fingerprint, items[id] )
  } )
  Object.keys(mathGraphics).forEach(id => {
    items[id] = evaluateGraphic(parser, mathGraphics[id], scope, idsByName, fingerprint)
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

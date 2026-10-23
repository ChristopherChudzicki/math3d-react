/**
 * Legacy-scene migration audit: rehydrate every scene the way this app does.
 *
 * Not part of `npm test`: the `.audit.js` suffix is outside CRA's default
 * testMatch. Run with an explicit --testMatch; see README.md in this folder.
 *
 * Env (absolute paths, since Jest's cwd is client/):
 *   LEGACY_AUDIT_DEFAULTS_OUT  write defaultSettings per type + initialState
 *   LEGACY_AUDIT_IN            JSONL from math3d-next's export_legacy_audit
 *   LEGACY_AUDIT_OUT           JSONL written here, one line per input line, same order
 */
import fs from 'fs'
import readline from 'readline'
import MathObjects from 'containers/MathObjects'
import { getItems } from 'containers/MathObjects/Folder/selectors'
import initialState from 'store/initialState'
import { rehydrate } from 'store/hydration'

const ONE_HOUR = 60 * 60 * 1000

function writeDefaults(outPath) {
  const defaultSettings = Object.fromEntries(
    Object.entries(MathObjects).map(([type, obj]) => [type, obj.defaultSettings])
  )
  fs.writeFileSync(
    outPath,
    JSON.stringify( { defaultSettings, initialState }, null, 2) + '\n'
  )
}

/**
 * Failures this app hits when loading or rendering a scene, beyond rehydrate
 * itself (which only merges objects and rarely throws).
 */
function legacyBreakage(state) {
  const reasons = []
  const { sortableTree, mathSymbols, sliderValues = {} } = state
  const folderIds = [...(sortableTree.setup || [] ), ...(sortableTree.root || [] )]
  folderIds.forEach(folderId => {
    try {
      getItems(state, folderId)
    }
    catch (error) {
      reasons.push(`folder_items: ${error.message}`)
    }
  } )
  Object.entries(mathSymbols).forEach(([id, symbol] ) => {
    if (
      symbol.type === 'VARIABLE_SLIDER' &&
      symbol.value === null &&
      sliderValues[id] === undefined
    ) {
      reasons.push('slider_value_missing')
    }
  } )
  return reasons
}

function auditLine(line) {
  const { key, dehydrated } = JSON.parse(line)
  let state
  try {
    state = rehydrate(dehydrated)
  }
  catch (error) {
    return { key, legacy_broken: [`rehydrate: ${error.message}`] }
  }
  const {
    mathGraphics, mathSymbols, folders, sortableTree, sliderValues, metadata
  } = state
  return {
    key,
    mathGraphics,
    mathSymbols,
    folders,
    sortableTree,
    sliderValues,
    metadata,
    legacy_broken: legacyBreakage(state)
  }
}

async function auditFile(inPath, outPath) {
  const out = fs.openSync(outPath, 'w')
  const lines = readline.createInterface( {
    input: fs.createReadStream(inPath),
    crlfDelay: Infinity
  } )
  let count = 0
  for await (const line of lines) {
    if (!line) continue
    fs.writeSync(out, JSON.stringify(auditLine(line)) + '\n')
    count += 1
  }
  fs.closeSync(out)
  return count
}

test('legacy audit: rehydrate', async () => {
  const { LEGACY_AUDIT_DEFAULTS_OUT, LEGACY_AUDIT_IN, LEGACY_AUDIT_OUT } = process.env
  if (LEGACY_AUDIT_DEFAULTS_OUT) {
    writeDefaults(LEGACY_AUDIT_DEFAULTS_OUT)
  }
  if (LEGACY_AUDIT_IN && LEGACY_AUDIT_OUT) {
    const count = await auditFile(LEGACY_AUDIT_IN, LEGACY_AUDIT_OUT)
    expect(count).toBeGreaterThan(0)
  }
}, ONE_HOUR)

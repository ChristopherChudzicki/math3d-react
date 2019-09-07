import 'source-map-support/register'
import './database/mongoose.config'
import { Graph } from './graph'
import { DATABASE_URI } from './database'
import mongoose from 'mongoose'
console.log(DATABASE_URI)
mongoose.connect(DATABASE_URI)

migrate()

async function migrate() {
  const cursor = Graph.find( {} ).cursor()
  const status = {
    started: 0,
    finished: 0,
    allStarted: false
  }

  cursor.on('data', graph => migrateOne(graph, status))
  cursor.on('close', () => {
    status.allStarted = true
  } )
}

async function migrateOne(graph, status) {
  status.started++
  const { _id, dehydrated } = graph
  console.log(`Working on ${_id}`)
  const numChanges = normalizePrefixes(dehydrated)
  const update = { $set: { dehydrated } }
  await Graph.updateOne( { _id }, update)
  console.log(`Finished ${_id}, made ${numChanges} changes`)
  status.finished++
  if (status.allStarted && status.finished === status.started) {
    console.log('closing connection')
    mongoose.connection.close()
    process.exit()
  }
}

function normalizePrefixes(dehydrated) {
  // mutates doc to change the function prefix from f(x,y,z) to _f(x,y,z) for:
  //   - implicit surfaces lhs and rhs props
  //   - vector fields expr prop
  const { mathGraphics } = dehydrated
  let numChanges = 0
  if (!mathGraphics) {
    return numChanges
  }

  const implicitSurfaces = Object.keys(mathGraphics)
    .map(key => mathGraphics[key] )
    .filter(mathGraphic => mathGraphic.type === 'IMPLICIT_SURFACE')
  const vectorFields = Object.keys(mathGraphics)
    .map(key => mathGraphics[key] )
    .filter(mathGraphic => mathGraphic.type === 'VECTOR_FIELD')

  implicitSurfaces.forEach(obj => {
    if (obj.hasOwnProperty('lhs') && !obj.lhs.startsWith('_')) {
      obj.lhs = '_' + obj.lhs
      numChanges++
    }
    if (obj.hasOwnProperty('rhs') && !obj.rhs.startsWith('_')) {
      obj.rhs = '_' + obj.rhs
      numChanges++
    }
  } )

  vectorFields.forEach(obj => {
    if (obj.hasOwnProperty('expr') && !obj.expr.startsWith('_')) {
      obj.expr = '_' + obj.expr
      numChanges++
    }
  } )
  return numChanges
}
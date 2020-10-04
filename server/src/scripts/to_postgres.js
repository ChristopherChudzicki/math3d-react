import { Graph } from '../graph'
import { DATABASE_URI } from '../database'
import mongoose from 'mongoose'

console.log(DATABASE_URI)
mongoose.connect(DATABASE_URI)

const migrateOne = (graph, status) => {
  status.started++
}

export async function migrate() {
  const cursor = Graph.find( {} ).cursor()
  const status = {
    started: 0,
    finished: 0,
    allStarted: false
  }

  cursor.on('data', graph => migrateOne(graph, status))
  cursor.on('close', () => {
    status.allStarted = true
    console.log(status)
  } )
}

import { getDb } from '../database'
import mongoose, { Schema, model } from 'mongoose'
import * as queries from '../graph/queries'

const { MONGODB_URI } = process.env

const GRAPH_COLLECTION = 'graph'

const dehydratedSchema = new Schema( {
  metadata: Object,
  sortableTree: Object,
  folders: Object,
  mathSymbols: Object,
  mathGraphics: Object,
  sliderValues: Object
}, { _id: false, minimize: false } )

const graphSchema = Schema( {
  dehydrated: dehydratedSchema,
  _id: String,
  timesAccessed: { type: Number, default: 0 }
} )

const Graph = model('Graph', graphSchema, GRAPH_COLLECTION)

mongoose.connect(MONGODB_URI)

const migrateOne = async (tx, graph, status) => {
  status.started++
  const { _id: urlKey, dehydrated } = graph;
  if (status.started % 100 === 0 ) {
    console.log(status);
  }
  await tx.none(queries.upsertGraph, { urlKey, dehydrated });
  if (status.finished % 100 === 0) {
    console.log(status);
  }
  status.finished++
}

export async function migrate() {
  const db = getDb({
    ssl: { sslmode: 'require', rejectUnauthorized: false }
  });

  const cursor = Graph.find( {} ).cursor()
  const status = {
    started: 0,
    finished: 0,
  }

  const readData = new Promise((resolve, reject) => {
    cursor.on('close', () => {
      console.log('Done reading.')
      resolve();
    } )
    cursor.on('error', e => reject(e));
  });

  db.txIf(async tx => {
    const writeData = [];
    cursor.on('data', graph => {
      writeData.push(migrateOne(tx, graph, status))
    })
    await readData;
    await Promise.all(writeData);
    console.log(status);
  });
}

import mongoose from 'mongoose'
import { Graph } from '../graph/model'
import fs from 'fs'
import { promisify } from 'util'
import { getDb } from './getDb';
import { attachDb } from './attachDb';

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

export const DATABASE_URI = process.env.MONGODB_URI
export async function seedDb() {
  const examplesDir = './examples'
  mongoose.connect(DATABASE_URI)

  // Save database object from the callback for reuse.
  const files = await readdir(examplesDir)
  const contents = await Promise.all(files.map(file => {
    return readFile(`${examplesDir}/${file}`, 'utf8')
  } ))

  const extension = '.json'
  const operations = contents.map((content, i) => {
    const _id = files[i].slice(0, -extension.length)
    const dehydrated = JSON.parse(content)
    return {
      updateOne: {
        filter: { _id },
        update: { dehydrated },
        upsert: true
      }
    }
  } )

  const bulk = await Graph.bulkWrite(operations)
  mongoose.connection.close()
  console.group()
  console.log('Database Seeded:')
  console.log(bulk)
  console.log('Database connection closed.')
  console.groupEnd()
}

export { getDb, attachDb };
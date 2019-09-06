import { Graph } from './graph/model'
import fs from 'fs'
import { promisify } from 'util'

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const EXAMPLES_DIR = './examples'

export async function seedDb(err, client) {

  if (err) {
    console.log(err)
    process.exit(1)
  }

  // Save database object from the callback for reuse.
  const files = await readdir(EXAMPLES_DIR)
  const contents = await Promise.all(files.map(file => {
    return readFile(`${EXAMPLES_DIR}/${file}`, 'utf8')
  } ))

  const extension = '.json'
  const operations = contents.map((content, i) => {
    const _id = files[i].slice(0, -extension.length)
    const dehyrated = JSON.parse(content)
    return {
      updateOne: {
        filter: { _id },
        update: { dehyrated },
        upsert: true
      }
    }
  } )

  const bulk = await Graph.bulkWrite(operations)
  console.group()
  console.log('Database Seeded:')
  console.log(bulk)
  console.groupEnd()
}

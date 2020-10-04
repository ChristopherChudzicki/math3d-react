import fs from 'fs'
import { promisify } from 'util'
import * as queries from '../graph/queries'

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

export async function seedDb(db) {
  const examplesDir = './examples'

  // Save database object from the callback for reuse.
  const files = await readdir(examplesDir)
  const contents = await Promise.all(files.map(file => {
    return readFile(`${examplesDir}/${file}`, 'utf8')
  } ))

  const extension = '.json'
  const examples = contents.map((content, i) => {
    const urlKey = files[i].slice(0, -extension.length)
    const dehydrated = JSON.parse(content)
    return { urlKey, dehydrated }
  } )

  await Promise.all(examples.map(example => db.none(queries.upsertGraph, example)))
}

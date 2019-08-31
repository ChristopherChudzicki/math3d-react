const dotenv = require('dotenv')
const mongodb = require('mongodb')
const fs = require('fs');
const promisify = require('util').promisify

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

const dir_path = './examples';
const GRAPH_COLLECTION = 'graph'

export async function seedDb(err, client){

  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  const db = client.db()
  console.log("Database connection ready")

  const collection = db.collection(GRAPH_COLLECTION)

  const files = await readdir(dir_path)
  const contents = await Promise.all( files.map(file => {
    return readFile(`${dir_path}/${file}`, 'utf8')
  } ) )
  const examples = contents.map(content => {
    return JSON.parse(content)
  } )

  const bulk = collection.initializeUnorderedBulkOp();
  examples.forEach((data, index) => {
    const extension = '.json'
    const _id = files[index].slice(0, -extension.length)
    bulk.find( { _id } ).upsert().update( { $set: { dehydrated: data } } );
  } )
  await bulk.execute()

  console.log("Database has been seeded.")
}

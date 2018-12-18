const dotenv = require('dotenv')
const mongodb = require('mongodb')
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const promisify = require('util').promisify

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

const dir_path = './server/examples';
const GRAPH_COLLECTION = 'graph'

dotenv.config()

if (argv.db === 'remote') {
  DATABASE_URI = process.env.REMOTE_MONGODB_URI
}
else if (argv.db === 'local') {
  DATABASE_URI = process.env.LOCAL_MONGODB_URI
}
else {
  console.log(`Expected 'db=local' or 'db=remote', instead 'db=${argv.db}'`)
  process.exit()
}

const options = { useNewUrlParser: true }
mongodb.MongoClient.connect(DATABASE_URI, options, async (err, client) => {

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
    bulk.find( { _id } ).upsert().update( { $set: data } );
  } )
  bulk.execute();

} )

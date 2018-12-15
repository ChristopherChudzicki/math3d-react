const dotenv = require('dotenv')
const mongodb = require('mongodb')
const argv = require('minimist')(process.argv.slice(2));

dotenv.config()

const GRAPH_COLLECTION = 'graph'

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

const examples = {
  1: { a: 'cat', b: 'zebra' },
  2: { a: 'cat', b: 'wolf' },
  3: { a: 'lion', b: 'dog' },
  4: { a: 'horse', b: 'dog' },
}

const options = { useNewUrlParser: true }
mongodb.MongoClient.connect(DATABASE_URI, options, function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  const db = client.db()
  console.log("Database connection ready")

  const collection = db.collection(GRAPH_COLLECTION)

  const bulk = collection.initializeUnorderedBulkOp();
  Object.keys(examples).forEach((key) => {
    bulk.find( { _id : key } ).upsert().update( { $set: examples[key] } );
  } )
  bulk.execute();

} )

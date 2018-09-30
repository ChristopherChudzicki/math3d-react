const dotenv = require('dotenv')
const mongodb = require('mongodb')

dotenv.config()

const DATABASE_URI = process.env.MONGODB_URI || process.env.LOCAL_MONGODB_URI
const GRAPH_COLLECTION = 'graph'

const examples = [
  { "_id": 1, "value": "cat" },
  { "_id": 2, "value": "dog" },
  { "_id": 3, "value": "zebra" }
]

mongodb.MongoClient.connect(DATABASE_URI, function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  const db = client.db()
  console.log("Database connection ready")

  const collection = db.collection(GRAPH_COLLECTION)

  collection.insertMany(examples)

})

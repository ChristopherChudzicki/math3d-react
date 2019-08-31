// From https://github.com/mars/heroku-cra-node
import 'source-map-support/register'
import express from 'express'
import { seedDb } from './initDb'
const bodyParser = require("body-parser");
const path = require('path')
const cluster = require('cluster')
const mongodb = require('mongodb')
const numCPUs = require('os').cpus().length

const PORT = process.env.PORT || 5000
const DATABASE_URI = process.env.MONGODB_URI || process.env.LOCAL_MONGODB_URI
const GRAPH_COLLECTION = 'graph'

const STATIC_DIR = path.resolve(__dirname, '../../client/build')

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

}
else {
  // will hold the db object
  let db;
  const app = express();

  // get json from request bodies
  app.use(bodyParser.json());

  // Priority serve any static files.
  app.use(express.static(STATIC_DIR));

  // Connect to the database before starting the application server.
  mongodb.MongoClient.connect(DATABASE_URI, async function (err, client) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    // This is silly. Currently seeding the db from each cluster.
    await seedDb(err, client)

    // Save database object from the callback for reuse.
    db = client.db()
    console.log("Database connection ready")

    app.listen(PORT, function () {
      console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`)
    })

    // Implement database API
   /**
    * "api/graph"
    * POST: post a new graph
    */
    app.post("/api/graph", function(req, res) {
      const newGraph = req.body;

      db.collection(GRAPH_COLLECTION).insertOne(newGraph, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to save new graph.");
        }
        else {
          res.status(201).json(doc.ops[0]);
        }
      });

    });
    /**
     * "api/graph:id"
     * GET: get graph by id
     * PUT: update graph by id
     * DELETE: delete graph by id
     */

    app.get("/api/graph/:id", function(req, res) {
      db.collection(GRAPH_COLLECTION).findOne({ _id: req.params.id }, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to get graph");
        }
        else {
          res.status(200).json(doc);
        }
      } );
    } );

    app.put("/api/graph/:id", function(req, res) {
      const update = req.body
      db.collection(GRAPH_COLLECTION).update({ _id: req.params.id }, { $set: update }, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to put data");
        } else {
          res.status(200).json(doc);
        }
      });
    } )

    // All remaining requests return the React app, so it can handle routing.
    app.get('*', function(request, response) {
      response.sendFile(path.resolve(STATIC_DIR, 'index.html'));
    });

  })
}

// Generic error handler used by all api endpoints.
function handleError(res, reason, message, code) {
  console.group()
  console.warn('Database Error')
  console.warn(reason)
  console.groupEnd()
  res.status(code || 500).json({"error": message});
}

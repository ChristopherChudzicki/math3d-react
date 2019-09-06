// From https://github.com/mars/heroku-cra-node
import 'source-map-support/register'
import express from 'express'
import { seedDb } from './initDb'
import { attachDb } from './middleware'
import { saveNewGraph, loadGraph } from './graph'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import path from 'path'
import cluster from 'cluster'
import mongodb from 'mongodb'
import { wrapAsync } from './utils'
const numCPUs = require('os').cpus().length

const PORT = process.env.PORT || 5000
const DATABASE_URI = process.env.MONGODB_URI || process.env.LOCAL_MONGODB_URI
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
  const app = express()

  // get json from request bodies
  app.use(bodyParser.json())

  // Priority serve any static files.
  app.use(express.static(STATIC_DIR))

  mongoose.connect(DATABASE_URI, { useNewUrlParser: true } )

  // Connect to the database before starting the application server.
  mongodb.MongoClient.connect(DATABASE_URI, async function (err, client) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    // This is silly. Currently seeding the db from each cluster.
    await seedDb(err, client)

    // Save database object from the callback for reuse.
    const db = client.db()
    console.log("Database connection ready")

    app.listen(PORT, function () {
      console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`)
    })

    app.use(attachDb(db))

    app.post("/api/graph", saveNewGraph)

    app.get("/api/graph/:id", wrapAsync(loadGraph))

    app.use(function(error, req, res, next) {
      console.group()
      console.warn('Server Error!')
      console.warn(error)
      console.groupEnd()
      res.status(500).json({ error: error.message });
    })

    // All remaining requests return the React app, so it can handle routing.
    app.get('*', function(request, response) {
      console.log("BACKUP ROUTE:")
      response.sendFile(path.resolve(STATIC_DIR, 'index.html'));
    });

  })
}

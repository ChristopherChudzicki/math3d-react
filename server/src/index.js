// From https://github.com/mars/heroku-cra-node
import 'source-map-support/register'
import express from 'express'
import { seedDb } from './initDb'
import { attachDb } from './middleware'
import { saveNewGraph, loadGraph, updateGraph } from './graph'
const bodyParser = require("body-parser");
const path = require('path')
const cluster = require('cluster')
const mongodb = require('mongodb')
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

    app.use(attachDb(db))

    app.post("/api/graph", saveNewGraph)

    app.get("/api/graph/:id", loadGraph)

    app.put("/api/graph/:id", updateGraph)

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

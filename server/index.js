// From https://github.com/mars/heroku-cra-node
const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const cluster = require('cluster')
const mongodb = require('mongodb')
const numCPUs = require('os').cpus().length

dotenv.config()

const PORT = process.env.PORT || 5000
const DATABASE_URI = process.env.MONGODB_URI || process.env.LOCAL_MONGODB_URI
const GRAPH_COLLECTION = 'graph'


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

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Connect to the database before starting the application server.
  mongodb.MongoClient.connect(DATABASE_URI, function (err, client) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = client.db()
    console.log("Database connection ready")

    app.listen(PORT, function () {
      console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`)
    })

    // Implement database API

    // Hello world
    app.get('/api/test', function (req, res) {
      res.set('Content-Type', 'application/json');
      res.send('{"message":"Hello from the custom server!"}');
    })

    // Get all graphs from the database
    app.get("/api/graph", function(req, res) {
      db.collection(GRAPH_COLLECTION).find({}).toArray(function(err, docs) {
        if (err) {
          console.log(`Failed to get graphs, error: ${err.message}`)
        } else {
          res.status(200).json(docs);
        }
      });
    });

    // All remaining requests return the React app, so it can handle routing.
    app.get('*', function(request, response) {
      response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
    });

  })
}

// Example api call:
// fetch('/api/graph')
//   .then(response => {
//     if (!response.ok) {
//       throw new Error(`status ${response.status}`);
//     }
//     return response.json();
//   })
//   .then(json => {
//     console.log({
//       message: json,
//       fetching: false
//     });
//   }).catch(e => {
//     console.log({
//       message: `API call failed: ${e}`,
//       fetching: false
//     });
//   })

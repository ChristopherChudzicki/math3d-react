import express from 'express'
import { saveNewGraph, loadGraph } from './graph'
import { wrapAsync } from './utils'
import bodyParser from 'body-parser'
import path from 'path'
import { getDb, attachDb } from './database'

const STATIC_DIR = path.resolve(__dirname, '../../client/build')
const PORT = process.env.PORT || 5000

export function startServer() {
  // will hold the db object
  const app = express()

  // get json from request bodies
  app.use(bodyParser.json())

  // Priority serve any static files.
  app.use(express.static(STATIC_DIR))

  const db = getDb();
  app.use(attachDb(db));

  app.listen(PORT, () => {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`)
  } )

  app.post('/api/graph', saveNewGraph)

  app.get('/api/graph/:id', wrapAsync(loadGraph))

  app.use(function(error, req, res, next) {
    console.group()
    console.warn('Server Error!')
    console.warn(error)
    console.groupEnd()
    res.status(500).json( { error: error.message } )
  } )

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    console.log('BACKUP ROUTE:')
    response.sendFile(path.resolve(STATIC_DIR, 'index.html'));
  } )
}

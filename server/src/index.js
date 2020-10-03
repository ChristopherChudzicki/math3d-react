// From https://github.com/mars/heroku-cra-node
import 'source-map-support/register'
import './database/mongoose.config'
import { seedDb, getDb } from './database'
import cluster from 'cluster'
import os from 'os'
import { startServer } from './server'

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`)
  seedDb(getDb())

  // Fork workers.
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  } )

}
else {
  startServer()
}

import { getDb } from './getDb'
import { attachDb } from './attachDb'
import { seedDb } from './seedDb'

const DATABASE_URI = process.env.MONGODB_URI

export { getDb, attachDb, seedDb, DATABASE_URI }

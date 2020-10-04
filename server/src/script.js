import 'source-map-support/register'
import './database/mongoose.config'
import { migrate } from './scripts/to_postgres'

/**
 * Run with:
 * node --require dotenv/config build/script.js
 */
migrate()
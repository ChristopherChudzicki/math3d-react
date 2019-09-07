import 'source-map-support/register'
import './database/mongoose.config'
import { migrate } from './scripts/fix_prefix'

migrate()
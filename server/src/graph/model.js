import { Schema, model } from 'mongoose'

const GRAPH_COLLECTION = 'graph'

const dehydratedSchema = new Schema( {
  metadata: Object,
  sortableTree: Object,
  folders: Object,
  mathSymbols: Object,
  mathGraphics: Object,
  sliderValues: Object
}, { _id: false, minimize: false } )

const graphSchema = Schema( {
  dehydrated: dehydratedSchema,
  _id: String,
  timesAccessed: { type: Number, default: 0 }
} )

export const Graph = model('Graph', graphSchema, GRAPH_COLLECTION)
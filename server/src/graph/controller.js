import { Graph } from './model'

export function saveNewGraph(req, res) {
  const newGraph = Graph(req.body)
  newGraph.save()
  res.status(201).json( { success: true } )
}

export async function loadGraph(req, res) {
  const update = { $inc: { timesAccessed: 1 } }
  const config = { new: true }
  const doc = await Graph.findByIdAndUpdate(
    req.params.id, update, config
  ).orFail()
  res.status(200).json(doc)
}
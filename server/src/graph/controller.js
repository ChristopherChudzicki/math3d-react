import * as queries from './queries';

export async function saveNewGraph(req, res) {
  const db = req.db;
  console.log(req.body)
  const { urlKey, dehydrated } = req.body;
  await db.none(queries.insertGraph, { urlKey, dehydrated });
  // const newGraph = Graph(req.body)
  // await newGraph.save()
  res.status(201).json( { success: true } )
}

export async function loadGraph(req, res) {
  // const update = { $inc: { timesAccessed: 1 } }
  // const config = { new: true }
  // const doc = await Graph.findByIdAndUpdate(
  //   req.params.id, update, config
  // ).orFail()
  const db = req.db;
  const row = await db.one(queries.getGraph, { urlKey: req.params.id })
  res.status(200).json(row)
}
import * as queries from "./queries";

export async function saveNewGraph(req, res) {
  const db = req.db;
  const { urlKey, dehydrated } = req.body;
  await db.none(queries.insertGraph, { urlKey, dehydrated });
  res.status(201).json({ success: true });
}

export async function loadGraph(req, res) {
  const db = req.db;
  const row = await db.one(queries.getGraph, { urlKey: req.params.id });
  res.status(200).json(row);
}

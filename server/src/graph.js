const GRAPH_COLLECTION = 'graph'

// Implement database API
/**
* "api/graph"
* POST: post a new graph
*/
export function saveNewGraph(req, res) {
  const newGraph = req.body;
  const db = req.db

  db.collection(GRAPH_COLLECTION).insertOne(newGraph, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to save new graph.");
    }
    else {
      res.status(201).json(doc.ops[0]);
    }
  });

}
/**
 * "api/graph:id"
 * GET: get graph by id
 * PUT: update graph by id
 * DELETE: delete graph by id
 */

export function loadGraph(req, res) {
  const db = req.db
  db.collection(GRAPH_COLLECTION).findOne({ _id: req.params.id }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get graph");
    }
    else {
      res.status(200).json(doc);
    }
  } );
}

export function updateGraph(req, res) {
  const update = req.body
  const db = req.db
  db.collection(GRAPH_COLLECTION).update({ _id: req.params.id }, { $set: update }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to put data");
    } else {
      res.status(200).json(doc);
    }
  });
}

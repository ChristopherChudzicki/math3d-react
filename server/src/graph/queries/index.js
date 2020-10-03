import getGraph from './get_graph.sql';
import insertGraph from './insert_graph.sql';
import upsertGraph from './upsert_graph.sql';

/**
 * TODO: Probably would be better to turn these queries into pg-promise
 * QueryFile objects, but having trouble with webpack.
 * Probably should not have used webpack on the backend =/.
 */

export { insertGraph, getGraph, upsertGraph }; 
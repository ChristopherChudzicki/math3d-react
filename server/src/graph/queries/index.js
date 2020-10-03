import path from 'path';
import saveGraph from './save_graph.sql';
import loadGraph from './load_graph.sql';

/**
 * TODO: Probably would be better to turn these queries into pg-promise
 * QueryFile objects, but having trouble with webpack.
 * Probably should not have used webpack on the backend =/.
 */

export { saveGraph, loadGraph }; 
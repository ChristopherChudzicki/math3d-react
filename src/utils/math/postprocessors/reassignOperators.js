import math from 'mathjs'

/**
 * Returns a node hander to be used as a mathjs's ExpressionTree.traverse callback
 *
 * @param  {Object} operatorFnMap maps old operator function names to new operator function names
 */
export default function reassignOperators(operatorFnMap) {
  for (let key of Object.keys(operatorFnMap)) {
    const fnName = operatorFnMap[key]
    if (math[fnName] === undefined) {
      throw Error(`math['${fnName}'] does not exist. (ExpressionTree Operators can only be reassigned to functions within the math (mathjs) namespace.)`)
    }
  }

  return node => {
    if (node.type === 'OperatorNode' && operatorFnMap[node.op] !== undefined) {
      node.fn = operatorFnMap[node.op]
    }
  }
}

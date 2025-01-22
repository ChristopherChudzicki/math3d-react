// @flow
import math from '../../../utils/mathjs'
import type { Node } from '../../../utils/mathjs/types'

/**
 * Returns a node hander to be used as a mathjs's ExpressionTree.traverse callback
 *
 * @param  {Object} operatorFnMap maps old operator function names to new operator function names
 */
export default function reassignOperators(operatorFnMap: {[string]: string} ) {
  for (let key of Object.keys(operatorFnMap)) {
    const fnName = operatorFnMap[key]
    if (!math.hasOwnProperty(fnName)) {
      throw Error(`math['${fnName}'] does not exist. (ExpressionTree Operators can only be reassigned to functions within the math (mathjs) namespace.)`)
    }
  }

  return (node: Node) => {
    if (node.type === 'OperatorNode' && operatorFnMap.hasOwnProperty(node.op)) {
      node.fn = operatorFnMap[node.op]
    }
  }
}

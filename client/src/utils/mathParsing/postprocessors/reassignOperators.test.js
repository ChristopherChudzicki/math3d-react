import math from 'utils/mathjs'
import reassignOperators from './reassignOperators'

describe('reassignOperators', () => {
  test('raises an error when operatorFnName not in scope', () => {
    const badfunc = () => reassignOperators( { '&': 'newAnd' } )
    expect(badfunc).toThrow(
      `math['newAnd'] does not exist. (ExpressionTree Operators can only be reassigned to functions within the math (mathjs) namespace.)`
    )
  } )

  test('successfully replaces operatorFn names', () => {
    const preprocessor = reassignOperators( { '&': 'cross', '|': 'dot' } )
    const tree = math.parse('(a & b) | c')
    tree.traverse(node => preprocessor(node))

    const bitOrNode = tree
    const parensNode = tree.args[0]
    const bitAndNode = parensNode.content
    expect(bitOrNode.fn).toBe('dot')
    expect(bitAndNode.fn).toBe('cross')
  } )
} )

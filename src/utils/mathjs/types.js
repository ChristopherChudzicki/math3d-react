// @flow

// These types are for a subset of MathJS that math3d uses
// Not complete! At all!

type Numeric = number | Array<Numeric>

// Parse tree types
// guided by http://mathjs.org/docs/expressions/expression_trees.html
// There are more methods/properties, but these are the ones we use.

type NodeBase<node> = {
  // Methods
  compile: () => { eval: Function },
  traverse: (
    callback: (child: node, path: string, parent: node) => void
  ) => void,
  // Properties
  comment: string,
  isNode: true,
}

type GenericNode<node> = NodeBase<node> & {
  type:
  | "AccessorNode"
  | "ArrayNode"
  // | "AssignmentNode" // treated separately, as are others commented out
  | "BlockNode"
  | "ConditionalNode"
  | "ConstantNode"
  | "IndexNode"
  // | "FunctionAssignmentNode"
  // | "FunctionNode"
  | "Node"
  | "ObjectNode"
  // | "OperatorNode"
  | "ParenthesisNode"
  | "RangeNode"
  // | "SymbolNode"
  | "UpdateNode",
  name: ?string
}

type AssignmentNode<node> = NodeBase<node> & {
  type: 'AssignmentNode',
  name: string,
  value: node
}

type FunctionAssignmentNode<node> = NodeBase<node> & {
  type: 'FunctionAssignmentNode',
  name: string,
  params: Array<string>,
  expr: node
}

type SymbolNode<node> = NodeBase<node> & {
  type: "SymbolNode",
  name: string
}

type FunctionNode<node> = NodeBase<node> & {
  type: "FunctionNode",
  name: string
}

type OperatorNode<node> = NodeBase<node> & {
  type: "OperatorNode",
  fn: string,
  op: string,
  name: void
}

export type Node =
  | GenericNode<Node>
  | AssignmentNode<Node>
  | FunctionAssignmentNode<Node>
  | SymbolNode<Node>
  | FunctionNode<Node>
  | OperatorNode<Node>

export type Math = {
  parse: string => Node,
  type: {
    DenseMatrix: Function
  },
  add: (Numeric, Numeric) => Numeric
}

// @flow

// These types are for a subset of MathJS that math3d uses
// Not complete! At all!

export type Numeric = number | Array<Numeric>

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
  type: | "AccessorNode"
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
    DenseMatrix: Function,
    Complex: Function
  },
  eval: (string, ?Object) => Numeric | Function,
  import: (Object, ?Object) => void,
  // TODO: The types below are too loose; e.g., add/subtract should both be
  // length-preserving polymorphic types; cross only works
  // with 3-component vectors, norm does not accept matrices
  add: (Numeric, Numeric) => Numeric,
  subtract: (Numeric, Numeric) => Numeric,
  divide: (Numeric, Numeric) => Numeric,
  multiply: (Numeric, Numeric) => Numeric,
  cross: (Numeric, Numeric) => Numeric,
  norm: (Numeric) => number,
  i: {im: number, re: number},
  acos: (number) => number,
  asin: (number) => number,
  atan: (number) => number,
  atan2: (y: number, x: number) => number,
  trace: (Numeric) => number,
  acosh: (number) => number,
  asinh: (number) => number,
  atanh: (number) => number,
}

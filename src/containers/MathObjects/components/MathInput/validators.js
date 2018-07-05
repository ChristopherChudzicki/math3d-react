export function isAssignmentRHS(parser, latex) {
  // Try assigning this RHS to a variable.
  // For now, fake variable name '__' is hard-coded. Not ideal...
  try {
    const tree = parser.parse(`__=${latex}`).tree
    if (tree.type === 'AssignmentNode' || tree.type === 'FunctionAssignmentNode') {
      return (tree.value.type === 'AssignmentNode' || tree.value.type === 'FunctionAssignmentNode')
        ? { isValid: false, errorMsg: 'Parse Error: Unexpected assignment' }
        : { isValid: true }
    }
    return {
      isValid: false,
      errorMsg: 'Parse Error: Invalid right-hand side.'
    }
  }
  catch (error) {
    return {
      isValid: false,
      errorMsg: `Parse Error: ${error.message}`
    }
  }
}

export function isAssignmentLHS(parser, latex) {
  try {
    const nodeType = parser.parse(`${latex}=1`).tree.type
    if (nodeType === 'AssignmentNode' || nodeType === 'FunctionAssignmentNode') {
      return {
        isValid: true
      }
    }
    return {
      isValid: false,
      errorMsg: 'Parse Error: invalid symbol name.'
    }
  }
  catch (error) {
    return {
      isValid: false,
      errorMsg: `Parse Error: ${error.message}`
    }
  }
}

export function isValidName(parser, latex, { usedNames } ) {
  const name = parser.parse(latex).name
  if (name === undefined) {
    throw Error(`Parse Error: Expression ${latex} does not have a name.`)
  }
  if (usedNames.has(name)) {
    return {
      isValid: false,
      errorMsg: `Name Error: name '${name}' is used more than once.`
    }
  }

  return {
    isValid: true
  }
}

// This validates the overall assignment. Just because we had to make a choice,
// we associate it with the LHS, and pass RHS as a validatorArgument.
// This catches cyclic assignment errors that would not otherwise be caught.
// Note: Expects a validated LHS
export function isAssignment(parser, latexLHS, { latexRHS } ) {
  const { isValid: validRHS } = isAssignmentRHS(parser, latexRHS)
  if (!validRHS) {
    // The overall assignment is not valid, but it's not the LHS's fault
    return { isValid: true }
  }
  try {
    parser.parse(latexLHS + '=' + latexRHS)
    return {
      isValid: true
    }
  }
  catch (error) {
    return {
      isValid: false,
      errorMsg: `Parse Error: ${error.message}`
    }
  }
}

export function isNumeric(parser, latex) {
  if (isNaN(latex)) {
    return {
      isValid: false,
      errorMsg: `Value Error: ${latex} is not a plain number`
    }
  }
  return {
    isValid: true
  }
}

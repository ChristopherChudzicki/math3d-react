export function isAssignmentRHS(parser, latex) {
  try {
    const nodeType = parser.parse(latex).tree.type
    if (nodeType === 'AssignmentNode' || nodeType === 'FunctionAssignmentNode') {
      return {
        isValid: false,
        errorMsg: `Parse Error: Unexpected assignment`
      }
    }
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

export function isValidName(parser, latex, usedNames) {
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

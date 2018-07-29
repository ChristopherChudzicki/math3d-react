function notEmpty(obj) {
  return Object.keys(obj).length > 0
}

const empty = {}

export function getErrors(id, ...errorsArray) {
  // Loop over the errors in order we care about
  for (const errors of errorsArray) {
    if (notEmpty(errors[id] )) {
      return errors[id]
    }
  }

  // return a constant empty, so equal by reference
  return empty

}

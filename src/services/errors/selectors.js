function notEmpty(obj) {
  return Object.keys(obj).length > 0
}

export function getErrors(id, ...errorsArray) {
  // Loop over the errors in order we care about
  for (const errors of errorsArray) {
    if (notEmpty(errors[id] )) {
      return errors[id]
    }
  }

  return {}

}

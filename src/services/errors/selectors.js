export function getErrorMsg(id, prop, ...errorsArray) {
  // Loop over the errors in order we care about
  for (const errors of errorsArray) {
    if (errors[id] && errors[id][prop] ) {
      return errors[id][prop]
    }
  }

  // return a constant empty, so equal by reference
  return null

}

export function getSafeMathSymbols(mathSymbols, parseErrors) {
  const safeIds = Object.keys(mathSymbols).filter(id => Object.keys(parseErrors[id] ).length === 0)
  const safeExprs = safeIds.map(id => `${mathSymbols[id].name}=${mathSymbols[id].value}`)
  return safeExprs
}

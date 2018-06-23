export function getSafeMathSymbols(mathSymbols, errors) {
  const safeIds = Object.keys(mathSymbols).filter(id => Object.keys(errors[id] ).length === 0)
  const safeExprs = safeIds.map(id => `${mathSymbols[id].name}=${mathSymbols[id].value}`)
  console.log(safeExprs)
}

import { VARIABLE_SLIDER } from 'containers/MathObjects/mathObjectTypes'

export function getParseableSymbols(mathSymbols, sliderValues, parseErrors) {
  const parseableSymbolIds = Object.keys(mathSymbols).filter(id => Object.keys(parseErrors[id] ).length === 0)
  return parseableSymbolIds.reduce((acc, id) => {
    const { name, value, type } = mathSymbols[id]
    acc.idsByName[name] = id
    if (value === null && type === VARIABLE_SLIDER) {
      acc.symbols[name] = `${name}=${sliderValues[id]}`
      return acc
    }
    acc.symbols[name] = `${name}=${value}`
    return acc
  }, { symbols: {}, idsByName: {} } )
}

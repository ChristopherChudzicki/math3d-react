import VariableSlider from 'containers/MathObjects/MathSymbols/VariableSlider'
import memoizeOne from 'memoize-one'

function _getParseableSymbols(parser, mathSymbols, sliderValues) {
  const initial = { symbols: {}, idsByName: {} }
  const seen = new Set()
  return Object.keys(mathSymbols).reduce((acc, id) => {
    const { name: lhs, value, type } = mathSymbols[id]
    const expr = (value === null && type === VariableSlider.type)
      ? `${lhs}=${sliderValues[id]}`
      : `${lhs}=${value}`

    // for functions, redux name is f(x) not f, we want f
    // TODO: change redux key to lhs and rhs

    let name
    try { name = parser.parse(expr).name }
    catch (err) { return acc /* handled in parseErrors already */ }

    // we only want symbols with unique names
    if (seen.has(name)) {
      delete acc.symbols[name]
      delete acc.idsByName[name]
    }
    else {
      seen.add(name)
      acc.symbols[name] = expr
      acc.idsByName[name] = id
    }
    return acc

  }, initial)

}

export const getParseableSymbols = memoizeOne(_getParseableSymbols)

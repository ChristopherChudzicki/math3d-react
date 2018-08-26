import VariableSlider from 'containers/MathObjects/MathSymbols/VariableSlider'
import memoizeOne from 'memoize-one'

function _getParseableSymbols(parser, mathSymbols, sliderValues, parseErrors) {
  const parseableSymbolIds = Object.keys(mathSymbols).filter(id => Object.keys(parseErrors[id] ).length === 0)
  return parseableSymbolIds.reduce((acc, id) => {
    const { name: lhs, value, type } = mathSymbols[id]
    const expr = (value === null && type === VariableSlider.type)
      ? `${lhs}=${sliderValues[id]}`
      : `${lhs}=${value}`

    // for functions, redux name is f(x) not f, we want f
    // TODO: change redux key to lhs and rhs
    const name = parser.parse(expr).name
    acc.symbols[name] = expr
    acc.idsByName[name] = id
    return acc
  }, { symbols: {}, idsByName: {} } )
}

export const getParseableSymbols = memoizeOne(_getParseableSymbols)

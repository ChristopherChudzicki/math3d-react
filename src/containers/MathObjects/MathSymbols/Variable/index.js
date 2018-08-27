// @flow
import { MathSymbol } from 'containers/MathObjects/MathObject'
import Variable from './components/Variable'
import { VARIABLE, defaultSettings } from './metadata'

export default new MathSymbol( {
  type: VARIABLE,
  defaultSettings: defaultSettings,
  uiComponent: Variable
} )

export { VARIABLE }

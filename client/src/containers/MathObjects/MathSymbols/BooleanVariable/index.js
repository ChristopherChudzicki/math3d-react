import { BOOLEAN_VARIABLE, defaultSettings } from './metadata'
import { connect } from 'react-redux'
import { MathSymbol } from 'containers/MathObjects/MathObject'
import { setProperty } from 'containers/MathObjects/actions'
import BooleanVariable from './components/BooleanVariable'

const mapStateToProps = ( { mathSymbols }, ownProps) => ( {
  value: mathSymbols[ownProps.id].value
} )

const mapDispatchToProps = {
  setProperty
}

export default new MathSymbol( {
  type: BOOLEAN_VARIABLE,
  defaultSettings: defaultSettings,
  uiComponent: connect(mapStateToProps, mapDispatchToProps)(BooleanVariable)
} )

export { BOOLEAN_VARIABLE }

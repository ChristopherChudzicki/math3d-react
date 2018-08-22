// @flow
import connect from 'react-redux'
import Settings from './components/SettingsContainer'
import {
  toggleProperty,
  setProperty
} from 'containers/MathObjects/actions'

const mapStateToProps = ( { mathGraphics, mathSymbols }, ownProps) => {
  const { parentId: id } = ownProps
  const data = mathGraphics[id] ? mathGraphics[id] : mathSymbols[id]
  return { data }
}

const mapDispatchToProps = {
  setProperty,
  toggleProperty
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)

// @flow
import { connect } from 'react-redux'
import Settings from './components/Settings'
import {
  setProperty
} from 'containers/MathObjects/actions'

const mapStateToProps = ( { mathGraphics, mathSymbols }, ownProps) => {
  const { parentId: id } = ownProps
  const data = mathGraphics[id] ? mathGraphics[id] : mathSymbols[id]
  return { data }
}

const mapDispatchToProps = {
  setProperty
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)

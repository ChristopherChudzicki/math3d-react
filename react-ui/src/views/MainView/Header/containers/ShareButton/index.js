import { connect } from 'react-redux'
import ShareButton from './components/ShareButton'
import { setProperty } from 'containers/MathObjects/actions'

const mapStateToProps = null
const mapDispatchToState = { setProperty }

export default connect(mapStateToProps, mapDispatchToState)(ShareButton)

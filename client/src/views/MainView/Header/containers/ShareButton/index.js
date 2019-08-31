import { connect } from 'react-redux'
import ShareButton from './components/ShareButton'
import { setProperty } from 'containers/MathObjects/actions'
import { setCreationDate } from 'services/metadata/actions'

const mapStateToProps = null
const mapDispatchToState = { setProperty, setCreationDate }

export default connect(mapStateToProps, mapDispatchToState)(ShareButton)

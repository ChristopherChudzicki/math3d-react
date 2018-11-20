import { connect } from 'react-redux'
import ShareButton from './components/ShareButton'
import { setProperty } from 'containers/MathObjects/actions'

const mapStateToProps = (state) => ( { state } )
const mapDispatchToState = { setProperty }

export default connect(mapStateToProps, mapDispatchToState)(ShareButton)

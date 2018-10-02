import { connect } from 'react-redux'
import ShareButton from './components/ShareButton'

const mapStateToProps = (state) => ( { state } )

export default connect(mapStateToProps)(ShareButton)

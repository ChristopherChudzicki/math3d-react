import MathBoxScene from './components/MathBoxScene'
import { connect } from 'react-redux'
import { setError } from 'services/errors'

const mapStateToProps = ( { mathGraphics, evalErrors, renderErrors } ) => ( {
  mathGraphics,
  evalErrors,
  renderErrors,
  order: Object.keys(mathGraphics)
} )

const mapDispatchToProps = {
  setError
}

export default connect(mapStateToProps, mapDispatchToProps)(MathBoxScene)

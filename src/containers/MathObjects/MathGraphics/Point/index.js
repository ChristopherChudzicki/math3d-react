import Point from './components/Point'
import { connect } from 'react-redux'

const mapStateToProps = ( { mathGraphics, parseErrors, evalErrors }, ownProps) => {
  const { id } = ownProps
  return {
    coords: mathGraphics[id].coords
  }
}

export default connect(mapStateToProps)(Point)

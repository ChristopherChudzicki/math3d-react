import Point from './components/Point'
import { connect } from 'react-redux'
import { makeMapDispatchToProps } from '../actions'
import { POINT } from './actions'
import { getErrors } from 'services/errors/selectors'

const mapStateToProps = ( { mathGraphics, parseErrors, evalErrors }, ownProps) => {
  const { id } = ownProps
  return {
    coords: mathGraphics[id].coords,
    color: mathGraphics[id].color,
    visible: mathGraphics[id].visible,
    errors: getErrors(id, parseErrors, evalErrors)
  }
}

const mapDispatchToProps = makeMapDispatchToProps(POINT)

export default connect(mapStateToProps, mapDispatchToProps)(Point)

// @flow
import type { OptionalizeSome } from '../../../../../utils/flow'
import EvaluatedStatusSymbol from './components/EvaluatedStatusSymbol'
import type { Props, OwnProps, DefaultProps } from './components/EvaluatedStatusSymbol'
import {
  toggleProperty,
  setProperty
} from '../../../../../containers/MathObjects/actions'

// For connecting
import { connect } from 'react-redux'

const mapStateToProps = ( { mathGraphics }, ownProps) => {
  const { id } = ownProps
  const {
    color,
    visible,
    useCalculatedVisibility,
    calculatedVisibility,
    type
  } = mathGraphics[id]
  return {
    color,
    visible,
    useCalculatedVisibility,
    calculatedVisibility,
    type
  }
}

const mapDispatchToProps = {
  toggleProperty,
  setProperty
}

type ConnectedProps = OptionalizeSome<Props, DefaultProps>
type ConnectedOwnProps = OptionalizeSome<OwnProps, DefaultProps>

export default connect<ConnectedProps, ConnectedOwnProps, _, _, _, _>(
  mapStateToProps, mapDispatchToProps
)(EvaluatedStatusSymbol)

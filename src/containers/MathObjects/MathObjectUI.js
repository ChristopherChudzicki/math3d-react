import MathObjectUI from './components/MathObjectUI'
import { connect } from 'react-redux'
import { setActiveObject } from './services/activeObject/actions'
import { getParent } from './selectors'
import { mapTypeToState, FOLDER } from './mathObjectTypes'
import {
  deleteMathObject,
  setProperty
} from './actions'

const mapStateToProps = (state, ownProps) => {
  const { id, type } = ownProps
  const mathObjectState = state[mapTypeToState[type]]
  const parentId = getParent(state.sortableTree, id)

  const isDeleteable = type === FOLDER
    ? state.sortableTree[id].length === 0
    : true

  return {
    isActive: state.activeObject === id,
    parentId,
    isDeleteable,
    positionInParent: state.sortableTree[parentId].indexOf(id),
    description: mathObjectState[id].description
  }
}

const mapDispatchToProps = {
  setActiveObject,
  deleteMathObject,
  setProperty
}

export default connect(mapStateToProps, mapDispatchToProps)(MathObjectUI)

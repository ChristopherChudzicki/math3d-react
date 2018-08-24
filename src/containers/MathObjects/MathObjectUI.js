import MathObjectUI from './components/MathObjectUI'
import { connect } from 'react-redux'
import { setActiveObject } from './services/activeObject/actions'
import { getParent } from './selectors'
import { FOLDER } from './Folder/metadata'
import {
  deleteMathObject,
  setProperty
} from './actions'

function getMathObjectData(state, id) {
  const { mathGraphics, mathSymbols, folders } = state
  let found = 0
  let value
  const substates = [mathGraphics, mathSymbols, folders]
  for (const substate of substates) {
    if (substate[id] ) {
      found += 1
      value = substate[id]
    }
  }

  if (found !== 1) {
    throw Error(`Expected ${id} to be present in exactly 1 of [mathGraphics, mathSymbols, folders] but it was present in ${found}`)
  }
  return value
}

const mapStateToProps = (state, ownProps) => {
  const { id, type } = ownProps
  const mathObjectData = getMathObjectData(state, id)
  const parentId = getParent(state.sortableTree, id)

  const isDeleteable = type === FOLDER
    ? state.sortableTree[id].length === 0
    : true

  return {
    isActive: state.activeObject === id,
    parentId,
    isDeleteable,
    positionInParent: state.sortableTree[parentId].indexOf(id),
    description: mathObjectData.description
  }
}

const mapDispatchToProps = {
  setActiveObject,
  deleteMathObject,
  setProperty
}

export default connect(mapStateToProps, mapDispatchToProps)(MathObjectUI)

import MathObject from './components/MathObject'
import { connect } from 'react-redux'
import { setActiveObject } from './services/activeObject/actions'
import { getParent } from './selectors'
import { mapTypeToState, FOLDER } from './mathObjectTypes'
import { deleteMathObject, setProperty } from './actions'
import createCachedSelector from 're-reselect';


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

const getOnEditDescription = createCachedSelector(
  (dispatch, id, type) => dispatch,
  (dispatch, id, type) => id,
  (dispatch, id, type) => type,
  (dispatch, id, type) => (...value) => dispatch(
    setProperty(id, type, 'description', value)
  )
)(
  (dispatch, id, type) => {
    return `${type}:${id}`
  }
)

const mapDispatchToProps = (dispatch, ownProps) => ( {
  setActiveObject: (id) => dispatch(setActiveObject(id)),
  onDelete: (parentFolderId, positionInParent) => dispatch(
    deleteMathObject(ownProps.id, ownProps.type, parentFolderId, positionInParent)
  ),
  onEditDescription: getOnEditDescription(dispatch, ownProps.id, ownProps.type)
} )

export default connect(mapStateToProps, mapDispatchToProps)(MathObject)

import ControllerHeader from './components/ControllerHeader'
import { connect } from 'react-redux'
import { getActiveFolder } from './selectors'
import {
  createPoint,
  createLine,
  createVariable,
  createFolder,
  createVariableSlider
} from 'containers/MathObjects'
import { setActiveObject } from 'containers/MathObjects/services/activeObject/actions'
import { setContentCollapsed } from 'containers/MathObjects/Folder/actions'

const mapStateToProps = ( { activeObject, sortableTree } ) => {
  const treeRoot = sortableTree.root
  const activeFolder = getActiveFolder(sortableTree, activeObject)

  // If no active folder, insert new items into last folder
  const targetFolder = activeFolder || treeRoot[treeRoot.length - 1]
  const newFolderIndex = treeRoot.indexOf(targetFolder) + 1

  const newItemIndex = sortableTree[targetFolder].includes(activeObject)
    ? sortableTree[targetFolder].indexOf(activeObject) + 1
    : 0

  return {
    targetFolder,
    newFolderIndex,
    newItemIndex
  }
}

const mapDispatchToProps = ( {
  createPoint,
  createLine,
  createFolder,
  createVariable,
  createVariableSlider,
  setActiveObject,
  setContentCollapsed
} )

export default connect(mapStateToProps, mapDispatchToProps)(ControllerHeader)

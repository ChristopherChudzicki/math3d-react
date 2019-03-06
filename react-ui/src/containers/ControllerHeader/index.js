// @flow
import ControllerHeader from './components/ControllerHeader'
import type { Props, OwnProps } from './components/ControllerHeader'
import { connect } from 'react-redux'
import { getActiveFolder } from './selectors'
import { createMathObject } from 'containers/MathObjects/actions'
import { setActiveObject } from 'containers/MathObjects/services/activeObject/actions'
import { setContentCollapsed } from 'containers/MathObjects/Folder/actions'

const mapStateToProps = ( { activeObject, sortableTree } ) => {
  const treeRoot = sortableTree.root
  const activeFolder = getActiveFolder(sortableTree, activeObject)

  if (Object.keys(treeRoot).length === 0) {
    throw Error('root folder requires at least 1 child')
  }

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
  createMathObject,
  setActiveObject,
  setContentCollapsed
} )

export default connect<Props, OwnProps, _, _, _, _>(
  mapStateToProps, mapDispatchToProps
)(ControllerHeader)

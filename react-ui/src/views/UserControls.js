import React from 'react'
import Drawer from '../containers/Drawer'
import SortableTree from 'containers/SortableTree'
import ControllerHeader from 'containers/ControllerHeader'
import ScrollWithOverflow from 'components/ScrollWithOverflow'
import MathObjects, {
  Folder,
  MathSymbols,
  MathGraphics,
  AXIS, GRID
} from 'containers/MathObjects'

// First sort the MathObject keys in the order we want, then extract the
// data relevant to ControllerHeader
const omit = new Set( [AXIS, GRID] )
const menuItems = [
  Folder.type,
  ...Object.keys(MathGraphics).filter(x => !omit.has(x)).sort(),
  ...Object.keys(MathSymbols).sort()
].map(type => ( {
  type,
  description: MathObjects[type].defaultSettings.description
} ))

const Math3dController = () => {
  return (
    <Drawer id='main' width='400px'>
      <ControllerHeader menuItems={menuItems}/>
      <ScrollWithOverflow>
        <SortableTree />
      </ScrollWithOverflow>
    </Drawer>
  )
}

export default Math3dController

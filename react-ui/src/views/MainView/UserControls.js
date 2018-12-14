import React from 'react'
import Drawer from 'containers/Drawer'
import SortableTree from 'containers/SortableTree'
import ControllerHeader from 'containers/ControllerHeader'
import ScrollWithOverflow from 'components/ScrollWithOverflow'
import MathObjects, {
  Folder,
  MathSymbols,
  MathGraphics,
  AXIS, GRID, CAMERA
} from 'containers/MathObjects'
import ControlledTabs, { TabPane } from 'containers/ControlledTabs'

// First sort the MathObject keys in the order we want, then extract the
// data relevant to ControllerHeader
const omit = new Set( [AXIS, GRID, CAMERA] )
const menuItems = [
  Folder.type,
  ...Object.keys(MathGraphics).filter(x => !omit.has(x)).sort(),
  ...Object.keys(MathSymbols).sort()
].map(type => ( {
  type,
  description: MathObjects[type].defaultSettings.description
} ))

const TabStyle = {
  overflow: 'visible'
}

const Math3dController = () => {
  return (
    <Drawer id='main' width='400px'>
      <ScrollWithOverflow>
        <ControlledTabs
          id='controls'
          tabBarExtraContent={<ControllerHeader menuItems={menuItems}/>}
          style={TabStyle}
          tabBarStyle={ { marginBottom: '0pt' } }
        >
          <TabPane tab='Main' key='1'>
            <SortableTree root='root' />
          </TabPane>
          <TabPane tab={<span> Axes & <br/> Camera</span>} key='2'>
            <SortableTree root='setup' />
          </TabPane>
        </ControlledTabs>
      </ScrollWithOverflow>
    </Drawer>
  )
}

export default Math3dController

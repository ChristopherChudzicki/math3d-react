import React from 'react'
import Drawer from 'containers/Drawer'
import SortableTree from 'containers/SortableTree'
import ControllerHeader from 'containers/ControllerHeader'
import ScrollWithOverflow from 'components/ScrollWithOverflow'
import { HEADER_HEIGHT_PX } from '../../../../constants'
import MathObjects, {
  Folder,
  MathSymbols,
  MathGraphics,
  AXIS, GRID, CAMERA
} from 'containers/MathObjects'
import ControlledTabs, { TabPane } from 'containers/ControlledTabs'
import styled from 'styled-components'

// First sort the MathObject keys in the order we want, then extract the
// data relevant to ControllerHeader
const omit = new Set( [AXIS, GRID, CAMERA] )
const menuItems = [
  Folder.type,
  ...Object.keys(MathGraphics).filter(x => !omit.has(x)).sort(),
  ...Object.keys(MathSymbols).sort()
].map(type => ( {
  type,
  description: MathObjects[type].defaultSettings.description,
  support: MathObjects[type].support
} ))

const StyledControlledTabs = styled(ControlledTabs)`
  &.ant-tabs {
    overflow: visible;
    height: calc(100% - ${ HEADER_HEIGHT_PX }px);
  }
  & .ant-tabs-bar {
    height: 65px;
    margin-bottom: 0px;
  }
  & > .ant-tabs-content {
    height: calc(100% - 65px);
  }
  & > .ant-tabs-content > ant-tabs-tabpane {
    height: 100%;
  }
`

const ControlsDrawer = () => {
  return (
    <Drawer id='main'>
      <StyledControlledTabs
        id='controls'
        tabBarExtraContent={<ControllerHeader menuItems={menuItems}/>}
      >
        <TabPane tab='Main' key='1'>
          <ScrollWithOverflow>
            <SortableTree root='root' />
          </ScrollWithOverflow>
        </TabPane>
        <TabPane tab={<span> Axes & <br/> Camera</span>} key='2'>
          <ScrollWithOverflow>
            <SortableTree root='setup' />
          </ScrollWithOverflow>
        </TabPane>
      </StyledControlledTabs>
    </Drawer>
  )
}

export default ControlsDrawer

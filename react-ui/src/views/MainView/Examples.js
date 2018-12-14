import React from 'react'
import Drawer from 'containers/Drawer'
import ControlledTabs, { TabPane } from 'containers/ControlledTabs'

const Examples = () => {
  return (
    <Drawer id='examples' slideTo='right'>
      <ControlledTabs id='examples'>
        <TabPane key='1' tab='Neat Examples'></TabPane>
        <TabPane key='2' tab='Feature Demo'></TabPane>
      </ControlledTabs>
    </Drawer>
  )
}

export default Examples

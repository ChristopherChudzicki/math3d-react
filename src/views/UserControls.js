import React from 'react'
import Drawer from '../containers/Drawer'
import SortableTree from 'containers/SortableTree'
import ControllerHeader from 'containers/ControllerHeader'
import ScrollWithOverflow from 'components/ScrollWithOverflow'

const Math3dController = () => {
  return (
    <Drawer id='main' width='400px'>
      <ControllerHeader/>
      <ScrollWithOverflow>
        <SortableTree />
      </ScrollWithOverflow>
    </Drawer>
  )
}

export default Math3dController

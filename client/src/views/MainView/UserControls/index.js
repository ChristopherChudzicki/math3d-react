import React, { Fragment } from 'react'
import ControlsDrawer from './components/ControlsDrawer'
import ScreenSizeDrawerManager from '../../../containers/Drawer/ScreenSizeDrawerManager'

export default function UserControls() {
  return (
    <Fragment>
      <ControlsDrawer />
      <ScreenSizeDrawerManager id='main'/>
    </Fragment>
  )
}

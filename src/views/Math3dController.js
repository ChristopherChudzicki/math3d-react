import React from 'react'
import Drawer from '../containers/Drawer'
import FlexContainer from '../components/FlexContainer'
import SortableTree from 'containers/SortableTree'

const Math3dController = (props) => {
  return (
    <Drawer id='main'>
      <FlexContainer style={ { overflow: 'scroll' } }>
        <SortableTree />
      </FlexContainer>
    </Drawer>
  )
}

export default Math3dController

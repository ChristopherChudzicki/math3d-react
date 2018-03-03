import React from 'react'
import Drawer from '../containers/Drawer'
import FlexContainer from '../components/FlexContainer'
import SortableList from '../containers/SortableList/components/SortableList'

const Math3dController = (props) => {
  return (
    <Drawer id='main'>
      <FlexContainer style={ { overflow: 'scroll' } }>
        <SortableList/>
      </FlexContainer>
    </Drawer>
  )
}

export default Math3dController

import React from 'react'
import Drawer from '../containers/Drawer'
import FlexContainer from '../components/FlexContainer'
import SortableListOld from '../containers/MathTree/components/SortableListOld'

const Math3dController = (props) => {
  return (
    <Drawer id='main'>
      <FlexContainer style={ { overflow: 'scroll' } }>
        <SortableListOld/>
      </FlexContainer>
    </Drawer>
  )
}

export default Math3dController

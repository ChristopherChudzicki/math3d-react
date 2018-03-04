import React from 'react'
import Drawer from 'containers/Drawer'
import FlexContainer from 'components/FlexContainer'
import MathTree from 'containers/MathTree'

const Examples = (props) => {
  return (
    <Drawer id='examples' slideTo='right'>
      <FlexContainer>
        <MathTree/>
      </FlexContainer>
    </Drawer>
  )
}

export default Examples

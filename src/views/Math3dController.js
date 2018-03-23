import React from 'react'
import Drawer from '../containers/Drawer'
import SortableTree from 'containers/SortableTree'
import styled from 'styled-components'

const ScrollingDiv = styled.div`
  overflow: scroll;
`

const Math3dController = (props) => {
  return (
    <Drawer id='main' width='400px'>
      <ScrollingDiv>
        <SortableTree />
      </ScrollingDiv>
    </Drawer>
  )
}

export default Math3dController

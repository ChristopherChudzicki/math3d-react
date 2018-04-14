import React from 'react'
import Drawer from '../containers/Drawer'
import SortableTree from 'containers/SortableTree'
import styled from 'styled-components'

const ScrollingDiv = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  padding-right: 100vw;
  margin-right: -100vw;
  height: 100%;
`

const Math3dController = () => {
  return (
    <Drawer id='main' width='400px'>
      <ScrollingDiv>
        <SortableTree />
      </ScrollingDiv>

    </Drawer>
  )
}

export default Math3dController

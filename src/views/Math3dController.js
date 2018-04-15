import React from 'react'
import Drawer from '../containers/Drawer'
import SortableTree from 'containers/SortableTree'
import styled from 'styled-components'
import ControllerHeader from 'containers/ControllerHeader'

const ScrollingDiv = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  padding-right: 500px;
  margin-right: -500px;
  height: calc(100% - 50px);
`

const Math3dController = () => {
  return (
    <Drawer id='main' width='400px'>
      <ControllerHeader/>
      <ScrollingDiv>
        <SortableTree />
      </ScrollingDiv>
    </Drawer>
  )
}

export default Math3dController

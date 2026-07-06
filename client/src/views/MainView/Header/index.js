// @flow
import React from 'react'
import styled from 'styled-components'
import { HEADER_HEIGHT_PX } from '../../../constants'
import ShareButton from './containers/ShareButton'
import HeaderButton from './components/HeaderButton'
import TitleInput from './containers/TitleInput'
import HelpButton from './components/HelpButton'
import ExamplesButton from './containers/ExamplesButton'
import store from '../../../store/index'
import HeaderMenu from './containers/HeaderMenu'
import { Menu } from 'antd'
const Item = Menu.Item

const HeaderContainer = styled.div`
  background-color: ${props => props.theme.gray[1]};
  height: ${ HEADER_HEIGHT_PX }px;
  display:flex;
  width:100%;
  align-items:center;
  justify-content: space-between;
  border-bottom: 1pt solid ${props => props.theme.gray[5]};
`

const HeaderGroup = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  display:flex;
  align-items:center;
`

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderGroup>
        <HeaderButton type='brand'>Math3D</HeaderButton>
        <TitleInput />
      </HeaderGroup>
      <HeaderGroup>
        <HeaderMenu>
          <Item><ExamplesButton /></Item>
          <Item><ShareButton getState={store.getState}/></Item>
          <Item><HelpButton/></Item>
        </HeaderMenu>
      </HeaderGroup>
    </HeaderContainer>
  )
}

export default Header

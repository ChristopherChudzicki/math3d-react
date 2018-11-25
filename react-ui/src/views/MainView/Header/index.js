// @flow
import React from 'react'
import styled from 'styled-components'
import ShareButton from './containers/ShareButton'
import HeaderButton from './components/HeaderButton'
import TitleInput from './containers/TitleInput'
import HelpButton from './components/HelpButton'

const HeaderContainer = styled.div`
  height:40px;
  background-color: ${props => props.theme.gray[1]};
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
        <ShareButton />
        <HelpButton/>
      </HeaderGroup>
    </HeaderContainer>
  )
}

export default Header

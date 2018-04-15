import React from 'react'
import styled from 'styled-components'

const HeaderContainer = styled.div`
  height:30px;
  background-color: ${props => props.theme.gray[1]};
  display:flex;
  width:100%;
  align-items:center;
  padding-left:5px;
  border-bottom: 1pt solid ${props => props.theme.gray[5]};
`
const Brand = styled.span`
  font-weight:900;
  font-size:125%;
  color: ${props => props.theme.gray[5]};
`

const Header = () => {
  return (
    <HeaderContainer>
      <Brand>Math3D</Brand>
    </HeaderContainer>
  )
}

export default Header

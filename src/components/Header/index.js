import React from 'react'
import styled from 'styled-components'

const HeaderContainer = styled.div`
  height:30px;
  background-color:#f8f8f8;
  display:flex;
  width:100%;
  align-items:center;
  padding-left:5px;
`
const Brand = styled.span`
  font-weight:900;
  font-size:125%;
  color:#bfbfbf;
`

const Header = (props) => {
  return (
    <HeaderContainer>
      <Brand>Math3D</Brand>
    </HeaderContainer>
  )
}

export default Header

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export const OuterContainer = styled.div`
  margin-top: 2px;
  margin-bottom: 2px;
  margin-left: 0px;
  margin-right: 0px;
`

export const FOLDER_STATUS_WIDTH = 20
export const FOLDER_STATUS_MARGIN = 3
export const FolderStatusContainer = styled.div`
  width: ${FOLDER_STATUS_WIDTH}px;
  margin: ${FOLDER_STATUS_MARGIN}px;
  display: flex;
  flex-direction:column;
  align-items: center;
`
const FolderStatusSymbol = styled.div`
  width:1px;
  height:100%;
  background-color:gray;
`

const MainContainer = styled.div`
  display:flex;
  flex-direction:column;
`

export const HeaderContainer = styled.div`
  display: flex;
  align-items:center;
  background-color:rgba(1,1,1,0.1);
`

export default function MathObject(props) {
  return (
    <OuterContainer style={ { display: 'flex' } }>
      <FolderStatusContainer>
        <FolderStatusSymbol />
      </FolderStatusContainer>
      <MainContainer>
        <HeaderContainer>
          <input type="text" placeholder={props.title}/>
        </HeaderContainer>
        {props.children}
      </MainContainer>
    </OuterContainer>
  )
}

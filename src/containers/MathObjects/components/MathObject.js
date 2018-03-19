import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export const OuterContainer = styled.div`
  display:flex;
  padding-top:2px;
  padding-bottom:2px;
  background-color: white;
  border-top: 1px solid ${props => props.theme.medium};
  border-bottom: 1px solid ${props => props.theme.medium};
  margin-top: ${props => props.isFirst ? '0px' : '-1px'};
  margin-bottom: ${props => props.isLast ? '-1px' : '0px'};
`

export const FOLDER_STATUS_WIDTH = 20
export const FOLDER_STATUS_MARGIN = 3
export const FolderStatusContainer = styled.div`
  width: ${FOLDER_STATUS_WIDTH}px;
  margin-left: ${FOLDER_STATUS_MARGIN}px;
  margin-right: ${FOLDER_STATUS_MARGIN}px;
  display: flex;
  flex-direction:column;
  align-items: center;
`
const FolderStatusSymbol = styled.div`
  width:1px;
  height:100%;
  background-color: ${props => props.theme.medium};
`

const MainContainer = styled.div`
  display:flex;
  flex-direction:column;
`

export const HeaderContainer = styled.div`
  margin-top:2px;
  margin-bottom:2px;
  display: flex;
  align-items:center;
`

MathObject.propTypes = {
  listIndex: PropTypes.number.isRequired,
  listLength: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType( [
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ] ).isRequired
}

export default function MathObject(props) {

  const isFirst = props.listIndex === 0
  const isLast = props.listIndex === (props.listLength - 1)

  return (
    <OuterContainer isFirst={isFirst} isLast={isLast} >
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

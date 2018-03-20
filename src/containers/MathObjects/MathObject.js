import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { connect } from 'react-redux'
import { setActiveObject } from 'containers/MathObjects/services/ActiveObject/actions'

export const OuterContainer = styled.div`
  display:flex;
  margin-top: -1px;
  margin-bottom: -1px;
  background-color: white;
  border: 1px solid ${props => props.theme.medium};
  ${props => props.isActive && css`
    background-color: ${props => props.theme.primaryLight}
  `}
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
  padding:2px;
`
const FolderStatusSymbol = styled.div`
  width:1px;
  height:100%;
  background-color: ${props => props.theme.medium};
`

const MainContainer = styled.div`
  display:flex;
  flex-direction:column;
  background-color:white;
  width:100%;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left:6px;
  padding-right:2px;
`

export const HeaderContainer = styled.div`
  margin-top:2px;
  margin-bottom:2px;
  display: flex;
  align-items:center;
`

MathObject.propTypes = {
  // passed as ownProps
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.oneOfType( [
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ] ).isRequired,
  // passed by mapStateToProps / mapDispatchToProps
  isActive: PropTypes.bool.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
}

function MathObject(props) {

  return (
    <OuterContainer
      isActive={props.isActive}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    >
      <FolderStatusContainer>
        <FolderStatusSymbol />
      </FolderStatusContainer>
      <MainContainer>
        <HeaderContainer>
          <input type="text" placeholder={props.description}/>
        </HeaderContainer>
        {props.children}
      </MainContainer>
    </OuterContainer>
  )
}

const mapStateToProps = (state, ownProps) => ( {
  isActive: state.activeObject === ownProps.id
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onFocus: () => dispatch(setActiveObject(ownProps.id)),
  onBlur: () => dispatch(setActiveObject(null))
} )

export default connect(mapStateToProps, mapDispatchToProps)(MathObject)

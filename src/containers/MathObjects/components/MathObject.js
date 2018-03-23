import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import EditableDescription from './EditableDescription'
import DeleteButton from './DeleteButton'

export const OuterContainer = styled.div`
  display:flex;
  background-color: white;
  margin-bottom: -1px;
  border: 1px solid ${props => props.theme.medium};
`

const SIDEPANEL_WIDTH = '40px'
export const SidePanel = styled.div`
  padding: 2px;
  width: ${SIDEPANEL_WIDTH};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition-duration: ${props => props.theme.transitionDuration};
  transition-timing-function: ${props => props.theme.transitionTimingFunction};
  transition-property: background-color;
  /* This makes fixed-width */
  flex-basis: auto;
  flex-grow: 0;
  flex-shrink: 0;
  ${props => props.isActive && css`
    background-color: ${props => props.theme.primaryLight}
  `}
`
const FolderStatusSymbol = styled.div`
  width:1px;
  height:100%;
  background-color: ${props => props.theme.medium};
`

const MainContainer = styled.div`
  display:flex;
  flex-direction:column;
  width: calc(100% - ${SIDEPANEL_WIDTH});
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 6px;
  padding-right: 6px;
`

const HeaderContainer = styled.div`
  position:relative;
`

MathObject.propTypes = {
  // passed as ownProps
  id: PropTypes.string.isRequired,
  isFolder: PropTypes.bool.isRequired,
  sidePanelContent: PropTypes.node.isRequired,
  children: PropTypes.oneOfType( [
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ] ).isRequired,
  // passed by mapStateToProps / mapDispatchToProps
  isActive: PropTypes.bool.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  onEditDescription: PropTypes.func.isRequired
}

MathObject.defaultProps = {
  sidePanelContent: <FolderStatusSymbol />,
  isFolder: false
}

export default function MathObject(props) {
  return (
    <Fragment>
      <OuterContainer
        onFocus={props.onFocus}
        onBlur={props.onBlur}
      >
        <SidePanel isActive={props.isActive}>
          {props.sidePanelContent}
        </SidePanel>
        <MainContainer>
          <HeaderContainer>
            <EditableDescription
              value={props.description}
              onChange={props.onEditDescription}
            />
            <DeleteButton
              onClick={() => console.log(`Delete object ${props.id}`)}
            />
          </HeaderContainer>
          {!props.isFolder && props.children}
        </MainContainer>
      </OuterContainer>
      {props.isFolder && props.children}
    </Fragment>
  )
}

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import EditableDescription from './EditableDescription'
import DeleteButton from './DeleteButton'

export const OuterContainer = styled.span`
  display: ${props => props.isActive ? 'inline-flex' : 'flex'};
  vertical-align: top; /*Removes extra space below inline element's baseline*/
  min-width:100%;
  background-color: white;
  margin-bottom: -1px;
  border: 1px solid ${props => props.theme.gray[5]};
  transition: all 5s;
  /*
  Note:
  - above, margin-bottom: -1px prevents double-thick borders between (Folders
    are also mathObjects)
  - But this causes very last MathObject in very last folder to lose its border.
  - This is taken care of by border on SortableListOfFolders
   */
`

const SIDEPANEL_WIDTH = '40px'
export const SidePanel = styled.div`
  margin-bottom:-1px; /*Compensates for margin-bottom:-1px in OuterContainer*/
  padding-top: 2px;
  padding-bottom: 2px;
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
    background-color: ${props => props.theme.primary[1]}
  `}
`
const AncestryLine = styled.div`
  width:1px;
  height:100%;
  background-color: ${props => props.theme.gray[5]};
  display:flex;
  flex-direction:column;
  justify-content: space-around;
  align-items: center;
`

const MainContainer = styled.div`
  display:flex;
  flex-direction:column;
  width: calc(100% - ${SIDEPANEL_WIDTH});
  padding-top: 8px;
  padding-bottom: ${props => props.isFolder ? '4px' : '8px'};
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
  description: PropTypes.string.isRequired,
  onEditDescription: PropTypes.func.isRequired
}

MathObject.defaultProps = {
  showAncestry: true,
  isFolder: false
}

export default function MathObject(props) {
  return (
    <Fragment>
      <OuterContainer
        onFocus={props.onFocus}
        isActive={props.isActive}
      >
        <SidePanel isActive={props.isActive}>
          {props.isFolder
            ? props.sidePanelContent
            : <AncestryLine> {props.sidePanelContent} </AncestryLine>
          }
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

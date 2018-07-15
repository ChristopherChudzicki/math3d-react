import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import EditableDescription from './EditableDescription'
import DeleteButton from './DeleteButton'
import { mathObjectTypes, FOLDER } from 'containers/MathObjects/mathObjectTypes'
import { theme } from 'constants/theme'

const OuterContainer = styled.span`
  display: inline-flex;
  vertical-align: top; /*Removes extra space below inline element's baseline*/
  min-width:100%;
  max-width: ${props => props.isActive ? 'auto' : '100%'};
  background-color: white;
  margin-bottom: -2px;
  border: 1px solid ${props => props.theme.gray[5]};
  transition-duration: ${props => props.theme.transitionDuration};
  transition-timing-function: ${props => props.theme.transitionTimingFunction};
  transition-property: all;
  ${props => props.isFolder && css`
    height:40px;
  `};
  ${props => props.isDeleting && css`
    transform: scale(0);
    transform-origin: top left;
  `}
  /*
  Note:
  - above, margin-bottom: -1px prevents double-thick borders between (Folders
    are also mathObjects)
  - But this causes very last MathObject in very last folder to lose its border.
  - This is taken care of by border on SortableListOfFolders
   */
`

const SIDEPANEL_WIDTH = '40px'
const SidePanel = styled.div`
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

export default class MathObject extends PureComponent {

  static propTypes = {
    // passed as ownProps
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    sidePanelContent: PropTypes.node,
    children: PropTypes.oneOfType( [
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ] ).isRequired,
    // passed by mapStateToProps / mapDispatchToProps
    isActive: PropTypes.bool.isRequired,
    setActiveObject: PropTypes.func.isRequired,
    description: PropTypes.string.isRequired,
    onEditDescription: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    parentId: PropTypes.string.isRequired,
    positionInParent: PropTypes.number.isRequired,
    isDeleteable: PropTypes.bool.isRequired
  }

  static defaultProps = {
    showAncestry: true,
    sidePanelContent: null
  }

  state = {
    isDeleting: false
  }

  onDelete = () => {
    this.props.setActiveObject(null)
    this.setState( { isDeleting: true } )
    setTimeout(
      () => this.props.onDelete(this.props.parentId, this.props.positionInParent),
      theme.transitionDurationMS
    )

  }

  onFocus = () => {
    this.props.setActiveObject(this.props.id)
  }

  render() {

    const {
      isActive,
      sidePanelContent,
      description,
      onEditDescription,
      type,
      children,
      isDeleteable
    } = this.props
    const isFolder = type === FOLDER

    return (
      <Fragment>
        <OuterContainer
          onFocus={this.onFocus}
          isActive={isActive}
          isFolder={isFolder}
          isDeleting={this.state.isDeleting}
        >
          <SidePanel isActive={isActive}>
            {isFolder
              ? sidePanelContent
              : <AncestryLine> {sidePanelContent} </AncestryLine>
            }
          </SidePanel>
          <MainContainer>
            <HeaderContainer>
              <EditableDescription
                value={description}
                onChange={onEditDescription}
                isFolder={isFolder}
              />
              <DeleteButton onClick={this.onDelete} disabled={!isDeleteable} />
            </HeaderContainer>
            {!isFolder && children}
          </MainContainer>
        </OuterContainer>
        {isFolder && children}
      </Fragment>
    )
  }

}

import React, { Fragment, PureComponent, createRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import EditableDescription from 'components/EditableDescription'
import DeleteButton from './DeleteButton'
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
  ${props => props.isDeleting && css`
    transform: scale(0);
    transform-origin: top left;
  `};
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
  padding-bottom: 8px;
  padding-left: 6px;
  padding-right: 6px;
  ${props => !props.isActive && css`
    overflow: hidden;
  `};
`

const HeaderContainer = styled.div`
  position:relative;
  max-width:75vw;
`

export default class MathObjectUI extends PureComponent {

  static propTypes = {
    // passed as ownProps
    id: PropTypes.string.isRequired,
    // TODO: is type necessary?
    // Lots of things use the type value in redux store.
    // Not sure anything actually uses the type prop
    type: PropTypes.string.isRequired,
    isFolder: PropTypes.bool.isRequired,
    sidePanelContent: PropTypes.node,
    children: PropTypes.oneOfType( [
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ] ).isRequired,
    // passed by mapStateToProps / mapDispatchToProps
    isActive: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    parentId: PropTypes.string.isRequired,
    positionInParent: PropTypes.number.isRequired,
    isDeleteable: PropTypes.bool.isRequired,
    setActiveObject: PropTypes.func.isRequired,
    setProperty: PropTypes.func.isRequired,
    deleteMathObject: PropTypes.func.isRequired
  }

  static defaultProps = {
    isFolder: false,
    showAncestry: true,
    sidePanelContent: null
  }

  state = {
    isDeleting: false,
    parentMaxWidth: null
  }

  constructor(props) {
    super(props)
    this.setProperty = this.setProperty.bind(this)
    this.onEditDescription = this.onEditDescription.bind(this)
    this.containerRef = createRef()
  }

  componentDidMount() {
    this.setState( { parentMaxWidth: this.getParentMaxWidth() } )
  }

  getParentMaxWidth() {
    // I want the EditableDescription Element's max width to be fixed, not
    // influenced by MathObject's overflow into the scene.
    // containerElement's parent element is the most recent ancestor
    // of EditableDescription that does not grow during overflow
    const { current: containerElement } = this.containerRef
    if (containerElement) {
      const parentWidth = containerElement.parentElement.offsetWidth
      // subtract 30 for the DeleteButton, 40 for the sidePanel
      return parentWidth
    }
    else {
      return undefined
    }
  }

  setProperty(property, value) {
    const { id, type } = this.props
    this.props.setProperty(id, type, property, value)
  }

  onEditDescription(value) {
    this.setProperty('description', value)
  }

  onDelete = () => {
    const { id, type, parentId, positionInParent } = this.props
    this.props.setActiveObject(null)
    this.setState( { isDeleting: true } )
    setTimeout(
      () => this.props.deleteMathObject(id, type, parentId, positionInParent),
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
      children,
      isDeleteable,
      isFolder
    } = this.props

    return (
      <Fragment
      >
        <OuterContainer
          ref={this.containerRef}
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
          <MainContainer isActive={isActive}>
            <HeaderContainer>
              <EditableDescription
                // subtracting 70 for sidepanel and delebutton
                maxwidth={this.state.parentMaxWidth - 70}
                value={description}
                onChange={this.onEditDescription}
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

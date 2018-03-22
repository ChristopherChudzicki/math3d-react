import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import EditableDescription from 'containers/MathObjects/components/EditableDescription'
import DeleteButton from 'containers/MathObjects/components/DeleteButton'
import { setActiveObject } from 'containers/MathObjects/services/activeObject/actions'

export const OuterContainer = styled.div`
  display:flex;
  background-color: white;
  margin-bottom: -1px;
  border: 1px solid ${props => props.theme.medium};
`

export const SidePanel = styled.div`
  padding: 2px;
  width: 30px;
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
  width:100%;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 6px;
  padding-right: 6px;
`

const HeaderContainer = styled.div`
  display: flex;
  align-items:center;
`

MathObject.propTypes = {
  // passed as ownProps
  id: PropTypes.string.isRequired,
  isFolder: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  sidePanelContent: PropTypes.node.isRequired,
  children: PropTypes.oneOfType( [
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ] ).isRequired,
  // passed by mapStateToProps / mapDispatchToProps
  isActive: PropTypes.bool.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
}

MathObject.defaultProps = {
  sidePanelContent: <FolderStatusSymbol />,
  isFolder: false
}

function MathObject(props) {
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

const mapStateToProps = (state, ownProps) => ( {
  isActive: state.activeObject === ownProps.id
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {
  onFocus: () => dispatch(setActiveObject(ownProps.id)),
  onBlur: () => dispatch(setActiveObject(null))
} )

export default connect(mapStateToProps, mapDispatchToProps)(MathObject)

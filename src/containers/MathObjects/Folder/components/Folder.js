import React, { Fragment } from 'react'
import SortableList from 'components/SortableList'
import Point from 'containers/MathObjects/Point'
import CollapsedIndicator from './CollapsedIndicator'
import Collapsible from 'react-collapsible'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import EditableDescription from 'containers/MathObjects/components/EditableDescription'
import { MAIN_PADDING } from 'containers/MathObjects/MathObject'

Folder.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  onToggleContentCollapsed: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  description: PropTypes.string.isRequired,
  animationSpeed: PropTypes.number.isRequired
}

Folder.defaultProps = {
  animationSpeed: 200
}

const FolderHeader = styled.div`
  display: flex;
  align-items:center;
  background-color: white;
  border: 1px solid ${props => props.theme.medium};
  padding-top:4px;
  padding-bottom:4px;
`

const DescriptionContainer = styled.div`
  padding-left: ${MAIN_PADDING.left};
  padding-right: ${MAIN_PADDING.right};
  width:100%;
`

export default function Folder(props) {
  const listClassName = props.isCollapsed ? 'collapsed' : ''
  return (
    <Fragment>
      <FolderHeader>
        <CollapsedIndicator
          isCollapsed={props.isCollapsed}
          onToggleContentCollapsed={props.onToggleContentCollapsed}
          animationSpeed={props.animationSpeed}
        />
        <DescriptionContainer>
          <EditableDescription
            value={props.description}
          />
        </DescriptionContainer>
      </FolderHeader>
      <Collapsible
        open={!props.isCollapsed}
        transitionTime={props.animationSpeed}
      >
        <SortableList
          className={listClassName}
          droppableType='FOLDER_ITEM'
          draggableType='FOLDER_ITEM'
          // this prevents dropping into collapsed folders
          isDropDisabled={props.isCollapsed}
          droppableId={props.id}
          items={props.items}
          renderItem={
            (item) => <Point id={item.id} />
          }
        />
      </Collapsible>
    </Fragment>
  )
}

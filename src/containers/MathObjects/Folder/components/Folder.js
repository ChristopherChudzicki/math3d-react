import React from 'react'
import SortableList from 'components/SortableList'
import {
  HeaderContainer
} from 'containers/MathObjects/components/MathObject'
import Point from 'containers/MathObjects/Point'
import CollapsedIndicator from './CollapsedIndicator'
import Collapsible from 'react-collapsible'
import PropTypes from 'prop-types'
import styled from 'styled-components'

Folder.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  onToggleContentCollapsed: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  animationSpeed: PropTypes.number.isRequired
}

Folder.defaultProps = {
  animationSpeed: 200
}

const FolderOuterContainer = styled.div`
  background-color: white;
  border: 1px solid ${props => props.theme.medium};
`

export default function Folder(props) {
  const listClassName = props.isCollapsed ? 'collapsed' : ''
  return (
    <FolderOuterContainer>
      <HeaderContainer>
        <CollapsedIndicator
          isCollapsed={props.isCollapsed}
          onToggleContentCollapsed={props.onToggleContentCollapsed}
          animationSpeed={props.animationSpeed}
        />
        {props.title}
      </HeaderContainer>
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
            (item, itemProps) => <Point id={item.id} {...itemProps}/>
          }
        />
      </Collapsible>
    </FolderOuterContainer>
  )
}

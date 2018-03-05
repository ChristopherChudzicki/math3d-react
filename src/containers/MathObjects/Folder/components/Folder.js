import React from 'react'
import SortableList from 'components/SortableList'
import styled from 'styled-components'
import ObjectIcon from 'containers/MathObjects/components/ObjectIcon'
import VisibilityIndicator from './VisibilityIndicator'
import Collapsible from 'react-collapsible'

const OuterContainer = styled.div`
  border: 1px solid black;
  margin: 2px;
`
const HeaderContainer = styled.div`
  display: flex;
  align-items:center;
  background-color:rgba(1,1,1,0.1);
`

export default function Folder(props) {
  const listClassName = props.isCollapsed ? 'collapsed' : ''
  return (
    <OuterContainer>
      <HeaderContainer>
        <ObjectIcon/>
        <VisibilityIndicator
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
          droppableId={props.id}
          items={props.items}
          renderItem={
            (item) => (<div>{item}</div>)
          }
        />
      </Collapsible>

    </OuterContainer>
  )
}

Folder.defaultProps = {
  animationSpeed: 200
}

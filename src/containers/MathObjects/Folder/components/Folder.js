import React from 'react'
import SortableList from 'components/SortableList'
import styled from 'styled-components'
import ObjectIcon from 'containers/MathObjects/components/ObjectIcon'
import VisibilityIndicator from './VisibilityIndicator'
import Collapsible from 'react-collapsible'
import PropTypes from 'prop-types'

const OuterContainer = styled.div`
  border: 1px solid black;
  margin: 2px;
`
const HeaderContainer = styled.div`
  display: flex;
  align-items:center;
  background-color:rgba(1,1,1,0.1);
`

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
          // this prevents dropping into collapsed folders
          isDropDisabled={props.isCollapsed}
          droppableId={props.id}
          items={props.items}
          renderItem={
            (item, itemProps) => (<div>{item.id}</div>)
          }
        />
      </Collapsible>

    </OuterContainer>
  )
}

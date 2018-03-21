import React from 'react'
import SortableList from 'components/SortableList'
import Point from 'containers/MathObjects/Point'
import CollapsedIndicator from './CollapsedIndicator'
import Collapsible from 'react-collapsible'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'

Folder.propTypes = {
  // Provided by ownProps
  id: PropTypes.string.isRequired,
  animationSpeed: PropTypes.number.isRequired, // has default
  // Provided by mapStateToProps / mapDispatchToProps
  isCollapsed: PropTypes.bool.isRequired,
  onToggleContentCollapsed: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  description: PropTypes.string.isRequired
}

Folder.defaultProps = {
  animationSpeed: 200
}

export default function Folder(props) {

  const listClassName = props.isCollapsed ? 'collapsed' : ''

  return (
    <MathObject
      id={props.id}
      description={props.description}
      isFolder={true}
      sidePanelContent={
        <CollapsedIndicator
          isCollapsed={props.isCollapsed}
          onToggleContentCollapsed={props.onToggleContentCollapsed}
          animationSpeed={props.animationSpeed}
        />
      }
    >
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
    </MathObject>
  )
}

import React from 'react'
import SortableList from 'components/SortableList'
import Point from 'containers/MathObjects/Point'
import CollapsedIndicator from './CollapsedIndicator'
import Collapsible from 'react-collapsible'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'
import theme from 'theme'

Folder.propTypes = {
  // Provided by ownProps
  id: PropTypes.string.isRequired,
  animationSpeed: PropTypes.number.isRequired, // has default
  // Provided by mapStateToProps / mapDispatchToProps
  isCollapsed: PropTypes.bool.isRequired,
  onToggleContentCollapsed: PropTypes.func.isRequired,
  itemIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  isActive: PropTypes.bool.isRequired
}

Folder.defaultProps = {
  animationSpeed: 200
}

export default function Folder(props) {

  const listClassName = props.isCollapsed ? 'collapsed' : ''

  return (
    <MathObject
      id={props.id}
      isFolder={true}
      sidePanelContent={
        <CollapsedIndicator
          isCollapsed={props.isCollapsed}
          onToggleContentCollapsed={props.onToggleContentCollapsed}
          animationSpeed={props.animationSpeed}
          lightenOnHover={props.isActive}
          backgroundColor={props.isActive ? theme.primaryLight : 'white'}
        />
      }
    >
      <Collapsible
        open={!props.isCollapsed}
        transitionTime={props.animationSpeed}
        overflowWhenOpen='visible'
      >
        <SortableList
          className={listClassName}
          droppableType='FOLDER_ITEM'
          draggableType='FOLDER_ITEM'
          // this prevents dropping into collapsed folders
          isDropDisabled={props.isCollapsed}
          droppableId={props.id}
          items={props.itemIds.map(id => ( { id } ))}
          renderItem={
            (item) => <Point id={item.id} />
          }
        />
      </Collapsible>
    </MathObject>
  )
}

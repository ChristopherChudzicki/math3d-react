import React from 'react'
import SortableList from 'components/SortableList'
import { Point, Variable } from 'containers/MathObjects'
import CollapsedIndicator from './CollapsedIndicator'
import Collapsible from 'react-collapsible'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'
import { FOLDER, POINT, VARIABLE } from 'containers/MathObjects/mathObjectTypes'
import theme from 'constants/theme'

Folder.propTypes = {
  // Provided by ownProps
  id: PropTypes.string.isRequired,
  animationSpeed: PropTypes.number.isRequired, // has default
  // Provided by mapStateToProps / mapDispatchToProps
  isCollapsed: PropTypes.bool.isRequired,
  onToggleContentCollapsed: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
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
      type={FOLDER}
      isFolder={true}
      sidePanelContent={
        <CollapsedIndicator
          isCollapsed={props.isCollapsed}
          onToggleContentCollapsed={props.onToggleContentCollapsed}
          animationSpeed={props.animationSpeed}
          lightenOnHover={props.isActive}
          backgroundColor={props.isActive ? theme.primary[1] : 'white'}
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
          items={props.items}
          renderItem={renderItem}
        />
      </Collapsible>
    </MathObject>
  )
}

function renderItem( { id, type } ) {
  switch (type) {

    case POINT:
      return <Point id={id}/>
    case VARIABLE:
      return <Variable id={id}/>
    default:
      throw Error(`Cannot render object ${id} with type ${type}`)

  }
}

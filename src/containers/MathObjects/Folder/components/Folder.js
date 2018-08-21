import React, { PureComponent } from 'react'
import SortableList from 'components/SortableList'
import MathObjects from 'containers/MathObjects'
import CollapsedIndicator from './CollapsedIndicator'
import Collapsible from 'react-collapsible'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'
import { FOLDER } from 'containers/MathObjects/mathObjectTypes'
import theme from 'constants/theme'

export default class Folder extends PureComponent {

  static propTypes = {
    // Provided by ownProps
    id: PropTypes.string.isRequired,
    animationSpeed: PropTypes.number.isRequired, // has default
    // Provided by mapStateToProps / mapDispatchToProps
    isCollapsed: PropTypes.bool.isRequired,
    onToggleContentCollapsed: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    isActive: PropTypes.bool.isRequired
  }

  static defaultProps = {
    animationSpeed: 200
  }

  constructor(props) {
    super(props)
    this.onToggleContentCollapsed = this.props.onToggleContentCollapsed.bind(this, this.props.id)
  }

  render() {
    const props = this.props
    const listClassName = props.isCollapsed ? 'collapsed' : ''
    return (
      <MathObject
        id={props.id}
        type={FOLDER}
        isFolder={true}
        sidePanelContent={
          <CollapsedIndicator
            isCollapsed={props.isCollapsed}
            onToggleContentCollapsed={this.onToggleContentCollapsed}
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

}

function renderItem( { id, type } ) {
  const SpecificMathObject = MathObjects[type]
  return <SpecificMathObject id={id }/>
}

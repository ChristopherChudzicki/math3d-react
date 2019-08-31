import React, { PureComponent } from 'react'
import SortableList from 'components/SortableList'
import MathGraphics from 'containers/MathObjects/MathGraphics'
import MathSymbols from 'containers/MathObjects/MathSymbols'
import CollapsedIndicator from './CollapsedIndicator'
import Collapsible from 'react-collapsible'
import PropTypes from 'prop-types'
import MathObjectUI from 'containers/MathObjects/MathObjectUI'
import theme from 'constants/theme'
import { FOLDER } from '../metadata'

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
    animationSpeed: 200,
    isDropDisabled: false
  }

  constructor(props) {
    super(props)
    this.onToggleContentCollapsed = this.props.onToggleContentCollapsed.bind(this, this.props.id)
  }

  render() {
    const props = this.props
    const listClassName = props.isCollapsed ? 'collapsed' : ''
    return (
      <MathObjectUI
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
            isDropDisabled={props.isCollapsed || props.isDropDisabled}
            droppableId={props.id}
            items={props.items}
            renderItem={renderItem}
          />
        </Collapsible>
      </MathObjectUI>
    )
  }

}

const FolderContents = { ...MathSymbols, ...MathGraphics }
function renderItem( { id, type } ) {
  const SpecificMathObject = FolderContents[type].uiComponent
  return <SpecificMathObject id={id }/>
}

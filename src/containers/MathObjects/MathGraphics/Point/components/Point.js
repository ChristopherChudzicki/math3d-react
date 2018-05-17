import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'
import {
  Settings,
  StatusSymbol,
  MainRow,
  MathQuillLarge
} from 'containers/MathObjects/components'
import { POINT } from 'containers/MathObjects/mathObjectTypes'

export default class Point extends PureComponent {

  state = {
    isSettingsVisible: false
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    coords: PropTypes.string.isRequired, // latex
    color: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    onEditCoords: PropTypes.func.isRequired,
    onToggleVisibility: PropTypes.func.isRequired,
    onSetColor: PropTypes.func.isRequired
  }

  onEditCoords = (mq) => {
    return this.props.onEditCoords(mq.latex())
  }

  render() {
    return (
      <MathObject
        id={this.props.id}
        type={POINT}
        sidePanelContent={
          <StatusSymbol
            color={this.props.color}
            isFilled={this.props.visible}
            onToggleVisibility={this.props.onToggleVisibility}
            onPickColor={this.props.onSetColor}
          />
        }
      >
        <MainRow
          innerRef={this.getRef}
        >
          <MathQuillLarge
            latex={this.props.coords}
            onEdit={this.onEditCoords}
          />
          <Settings title='Point Settings'>
            <p>Hello</p>
            <p>World</p>
            <div style={ { height: '20px', width: '300px', backgroundColor: 'blue' } }/>
          </Settings>

        </MainRow>
      </MathObject>
    )
  }

}

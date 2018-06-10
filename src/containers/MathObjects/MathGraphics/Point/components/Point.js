import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'
import {
  Settings,
  StatusSymbol,
  MainRow,
  MathInput
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
    onEditProperty: PropTypes.func.isRequired,
    onToggleVisibility: PropTypes.func.isRequired,
    onSetColor: PropTypes.func.isRequired,
    onErrorChange: PropTypes.func.isRequired,
    errors: PropTypes.objectOf(PropTypes.string).isRequired
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
          <MathInput
            field='coords'
            errorMsg={this.props.errors.coords}
            latex={this.props.coords}
            onTextChange={this.props.onEditProperty}
            onErrorChange={this.props.onErrorChange}
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

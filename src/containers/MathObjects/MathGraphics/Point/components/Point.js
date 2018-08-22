import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'
import {
  Settings,
  StatusSymbol,
  MainRow
} from 'containers/MathObjects/components'
import { MathInputRHS } from 'containers/MathObjects/containers/MathInput'
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
    errors: PropTypes.objectOf(PropTypes.string).isRequired,
    toggleProperty: PropTypes.func.isRequired,
    setProperty: PropTypes.func.isRequired
  }

  static computedProps = [
    'coords'
  ]

  constructor(props) {
    super(props)
    const { id } = this.props
    const type = POINT
    this.toggleProperty = this.props.toggleProperty.bind(this, id, type)
    this.setProperty = this.props.setProperty.bind(this, id, type)
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
            onToggleVisibility={() => this.toggleProperty('visible')}
            onPickColor={value => this.setProperty('color', value)}
          />
        }
      >
        <MainRow>
          <MathInputRHS
            field='coords'
            parentId={this.props.id}
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

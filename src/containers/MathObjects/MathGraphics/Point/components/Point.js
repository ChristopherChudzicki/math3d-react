import React, { PureComponent } from 'react'
import MathGraphic from 'containers/MathObjects/MathGraphics/MathGraphic'
import PropTypes from 'prop-types'
import {
  Settings,
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
    coords: PropTypes.string.isRequired // latex
  }

  static computedProps = [
    'coords'
  ]

  render() {
    return (
      <MathGraphic
        type={POINT}
        id={this.props.id}
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
      </MathGraphic>
    )
  }

}

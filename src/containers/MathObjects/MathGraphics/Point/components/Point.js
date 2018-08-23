import React, { PureComponent } from 'react'
import MathGraphic from 'containers/MathObjects/MathGraphics/MathGraphic'
import PropTypes from 'prop-types'
import {
  MainRow
} from 'containers/MathObjects/components'
import Settings from 'containers/MathObjects/containers/Settings'
import { MathInputRHS } from 'containers/MathObjects/containers/MathInput'
import { POINT } from 'containers/MathObjects/mathObjectTypes'

const settingsList = [
  {
    property: 'label',
    inputType: 'text'
  },
  {
    property: 'labelVisible',
    inputType: 'boolean'
  },
  {
    property: 'size',
    inputType: 'math'
  },
  {
    property: 'opacity',
    inputType: 'math'
  },
  {
    property: 'zBias',
    inputType: 'math'
  }
]

export default class Point extends PureComponent {

  state = {
    isSettingsVisible: false
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    coords: PropTypes.string.isRequired // latex
  }

  static computedProps = [
    'coords',
    'size',
    'opacity'
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
          <Settings
            title='Point Settings'
            parentId={this.props.id}
            settingsList={settingsList}
          />
        </MainRow>
      </MathGraphic>
    )
  }

}

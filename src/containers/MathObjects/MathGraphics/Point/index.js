import React, { PureComponent } from 'react'
import MathGraphicUI from 'containers/MathObjects/MathGraphics/MathGraphicUI'
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

export class PointUI extends PureComponent {

  state = {
    isSettingsVisible: false
  }

  static propTypes = {
    id: PropTypes.string.isRequired
  }

  static computedProps = [
    'coords',
    'size',
    'opacity'
  ]

  render() {
    return (
      <MathGraphicUI
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
      </MathGraphicUI>
    )
  }

}

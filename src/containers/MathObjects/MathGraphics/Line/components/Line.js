import React, { PureComponent } from 'react'
import MathGraphic from 'containers/MathObjects/MathGraphics/MathGraphic'
import PropTypes from 'prop-types'
import {
  MainRow
} from 'containers/MathObjects/components'
import Settings from 'containers/MathObjects/containers/Settings'
import { MathInputRHS } from 'containers/MathObjects/containers/MathInput'
import { LINE } from 'containers/MathObjects/mathObjectTypes'

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
    property: 'width',
    inputType: 'math'
  },
  {
    property: 'start',
    inputType: 'boolean',
    label: 'start arrow'
  },
  {
    property: 'end',
    inputType: 'boolean',
    label: 'end arrow'
  },
  {
    property: 'size',
    inputType: 'math',
    label: 'arrow size'
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

export default class Line extends PureComponent {

  state = {
    isSettingsVisible: false
  }

  static propTypes = {
    id: PropTypes.string.isRequired
  }

  static computedProps = [
    'coords',
    'size',
    'opacity',
    'width',
    'zBias',
    'zIndex'
  ]

  render() {
    return (
      <MathGraphic
        type={LINE}
        id={this.props.id}
      >
        <MainRow>
          <MathInputRHS
            field='coords'
            parentId={this.props.id}
          />
          <Settings
            title='Line Settings'
            parentId={this.props.id}
            settingsList={settingsList}
          />
        </MainRow>
      </MathGraphic>
    )
  }

}

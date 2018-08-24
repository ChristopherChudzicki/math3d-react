import React, { PureComponent } from 'react'
import MathGraphicUI from 'containers/MathObjects/MathGraphics/MathGraphicUI'
import PropTypes from 'prop-types'
import { POINT } from 'containers/MathObjects/mathObjectTypes'
import { pointMeta } from '../metadata'

export class PointUI extends PureComponent {

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
        mainField='coords'
        metadata={pointMeta}/>
    )
  }

}

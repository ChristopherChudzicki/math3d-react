import React, { PureComponent } from 'react'
import MathGraphicUI from 'containers/MathObjects/MathGraphics/MathGraphicUI'
import PropTypes from 'prop-types'
import { LINE } from 'containers/MathObjects/mathObjectTypes'
import { lineMeta } from '../metadata'

export class LineUI extends PureComponent {

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
      <MathGraphicUI
        type={LINE}
        id={this.props.id}
        mainField={'coords'}
        metadata={lineMeta}/>
    )
  }

}

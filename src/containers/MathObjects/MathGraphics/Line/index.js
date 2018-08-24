// @flow
import React, { PureComponent } from 'react'
import { Line as LineGraphic } from 'components/MathBox'
import MathGraphic from '../MathGraphic'
import MathGraphicUI from 'containers/MathObjects/MathGraphics/MathGraphicUI'
import { lineMeta } from '../metadata'

export const LINE = 'LINE'

type Props = {
  id: string
}

export class LineUI extends PureComponent<Props> {

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

export default new MathGraphic( {
  type: LINE,
  metadata: lineMeta,
  uiComponent: LineUI,
  mathboxComponent: LineGraphic
} )

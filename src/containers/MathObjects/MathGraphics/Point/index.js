// @flow
import React, { PureComponent } from 'react'
import { Point as PointGraphic } from 'components/MathBox'
import MathGraphic from '../MathGraphic'
import MathGraphicUI from 'containers/MathObjects/MathGraphics/MathGraphicUI'
import { pointMeta } from '../metadata'

export const POINT = 'POINT'

type Props = {
  id: string
}

export class PointUI extends PureComponent<Props> {

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

export default new MathGraphic( {
  type: POINT,
  metadata: pointMeta,
  uiComponent: PointUI,
  mathboxComponent: PointGraphic
} )

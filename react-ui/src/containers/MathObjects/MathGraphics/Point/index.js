// @flow
import React, { PureComponent } from 'react'
import { Point as PointGraphic } from 'components/MathBox'
import MathGraphic from '../MathGraphic'
import MathGraphicUI from '../containers/MathGraphicUI'
import { pointMeta } from '../metadata'
import { MainRow } from 'containers/MathObjects/components'
import { MathInputRHS } from 'containers/MathObjects/containers/MathInput'

export const POINT = 'POINT'

type Props = {
  id: string
}

export class PointUI extends PureComponent<Props> {

  render() {
    return (
      <MathGraphicUI
        type={POINT}
        id={this.props.id}
        metadata={pointMeta}>
        <MainRow>
          <MathInputRHS parentId={this.props.id} field='coords'/>
        </MainRow>
      </MathGraphicUI>
    )
  }

}

export default new MathGraphic( {
  type: POINT,
  metadata: pointMeta,
  uiComponent: PointUI,
  mathboxComponent: PointGraphic
} )

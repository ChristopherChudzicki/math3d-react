// @flow
import React, { PureComponent } from 'react'
import { Vector as VectorGraphic } from 'components/MathBox'
import MathGraphic from '../MathGraphic'
import MathGraphicUI from 'containers/MathObjects/MathGraphics/MathGraphicUI'
import { vectorMeta } from '../metadata'
import { MainRow } from 'containers/MathObjects/components'
import { MathInputRHS } from 'containers/MathObjects/containers/MathInput'

export const VECTOR = 'VECTOR'

type Props = {
  id: string
}

export class VectorUI extends PureComponent<Props> {

  render() {
    return (
      <MathGraphicUI
        type={VECTOR}
        id={this.props.id}
        mainField={'components'}
        metadata={vectorMeta}>
        <MainRow>
          <MathInputRHS parentId={this.props.id} field='components'/>
        </MainRow>
      </MathGraphicUI>
    )
  }

}

export default new MathGraphic( {
  type: VECTOR,
  metadata: vectorMeta,
  uiComponent: VectorUI,
  mathboxComponent: VectorGraphic
} )

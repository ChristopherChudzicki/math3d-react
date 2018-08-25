// @flow
import React, { PureComponent } from 'react'
import { Vector as VectorGraphic } from 'components/MathBox'
import MathGraphic from '../MathGraphic'
import MathGraphicUI from 'containers/MathObjects/MathGraphics/MathGraphicUI'
import { vectorMeta } from '../metadata'

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
        metadata={vectorMeta}/>
    )
  }

}

export default new MathGraphic( {
  type: VECTOR,
  metadata: vectorMeta,
  uiComponent: VectorUI,
  mathboxComponent: VectorGraphic
} )

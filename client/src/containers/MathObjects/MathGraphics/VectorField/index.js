// @flow
import React, { PureComponent } from 'react'
import { VectorField as VectorFieldGraphic } from 'components/MathBox'
import MathGraphic from '../MathGraphic'
import MathGraphicUI from '../containers/MathGraphicUI'
import { vectorFieldMeta } from '../metadata'
import { MainRow } from 'containers/MathObjects/components'
import {
  MathInputRHS,
  StaticMathStyled
} from 'containers/MathObjects/containers/MathInput'

export const VECTOR_FIELD = 'VECTOR_FIELD'

type Props = {
  id: string
}

const justifyRight = {
  justifyContent: 'flex-end'
}
const rangeStyle = {
  flex: 0
}

export class VectorFieldUI extends PureComponent<Props> {

  render() {
    return (
      <MathGraphicUI
        type={VECTOR_FIELD}
        id={this.props.id}
        metadata={vectorFieldMeta}>
        <MainRow>
          <MathInputRHS
            field='expr'
            prefix='_f(x,y,z)='
            parentId={this.props.id}
          />
        </MainRow>
        <MainRow style={justifyRight}>
          <StaticMathStyled latex='x\in' size='small'/>
          <MathInputRHS
            size='small'
            parentId={this.props.id}
            field='rangeX'
            style={rangeStyle}
          />
        </MainRow>
        <MainRow style={justifyRight}>
          <StaticMathStyled latex='y\in' size='small'/>
          <MathInputRHS
            size='small'
            parentId={this.props.id}
            field='rangeY'
            style={rangeStyle}
          />
        </MainRow>
        <MainRow style={justifyRight}>
          <StaticMathStyled latex='z\in' size='small'/>
          <MathInputRHS
            size='small'
            parentId={this.props.id}
            field='rangeZ'
            style={rangeStyle}
          />
        </MainRow>
      </MathGraphicUI>
    )
  }

}

export default new MathGraphic( {
  type: VECTOR_FIELD,
  description: 'Vector Field',
  metadata: vectorFieldMeta,
  uiComponent: VectorFieldUI,
  mathboxComponent: VectorFieldGraphic
} )

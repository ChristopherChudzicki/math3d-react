// @flow
import React, { PureComponent } from 'react'
import { ParametricSurface as ParametricSurfaceGraphic } from 'components/MathBox'
import MathGraphic from '../MathGraphic'
import MathGraphicUI from '../containers/MathGraphicUI'
import { parametricSurfacaMeta } from '../metadata'
import { MainRow } from 'containers/MathObjects/components'
import {
  MathInputRHS,
  StaticMathStyled
} from 'containers/MathObjects/containers/MathInput'

export const PARAMETRIC_SURFACE = 'PARAMETRIC_SURFACE'

type Props = {
  id: string
}

const justifyRight = {
  justifyContent: 'flex-end'
}
const rangeStyle = {
  flex: 0
}

export class ParametricSurfaceUI extends PureComponent<Props> {

  render() {
    return (
      <MathGraphicUI
        type={PARAMETRIC_SURFACE}
        id={this.props.id}
        metadata={parametricSurfacaMeta}>
        <MainRow>
          <MathInputRHS
            field='expr'
            prefix='_f(u,v)='
            parentId={this.props.id}
          />
        </MainRow>
        <MainRow style={justifyRight}>
          <StaticMathStyled latex='u\in' size='small'/>
          <MathInputRHS
            size='small'
            parentId={this.props.id}
            field='uRange'
            style={rangeStyle}
          />
        </MainRow>
        <MainRow style={justifyRight}>
          <StaticMathStyled latex='v\in' size='small'/>
          <MathInputRHS
            size='small'
            parentId={this.props.id}
            field='vRange'
            style={rangeStyle}
          />
        </MainRow>
      </MathGraphicUI>
    )
  }

}

export default new MathGraphic( {
  type: PARAMETRIC_SURFACE,
  description: 'Parametric Surface',
  metadata: parametricSurfacaMeta,
  uiComponent: ParametricSurfaceUI,
  mathboxComponent: ParametricSurfaceGraphic
} )

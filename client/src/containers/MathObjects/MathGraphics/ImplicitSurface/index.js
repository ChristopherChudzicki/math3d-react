// @flow
import React, { PureComponent } from 'react'
import { ImplicitSurface as ImplicitSurfaceGraphic } from 'components/MathBox'
import MathGraphic from '../MathGraphic'
import MathGraphicUI from '../containers/MathGraphicUI'
import { implicitSurfaceMeta } from '../metadata'
import { MainRow } from 'containers/MathObjects/components'
import {
  MathInputRHS,
  StaticMathStyled
} from 'containers/MathObjects/containers/MathInput'

export const IMPLICIT_SURFACE = 'IMPLICIT_SURFACE'

type Props = {
  id: string
}

const justifyRight = {
  justifyContent: 'flex-end'
}
const rangeStyle = {
  flex: 0
}

export class ImplicitSurfaceUI extends PureComponent<Props> {

  render() {
    return (
      <MathGraphicUI
        type={IMPLICIT_SURFACE}
        id={this.props.id}
        metadata={implicitSurfaceMeta}>
        <MainRow>
          <MathInputRHS
            field='lhs'
            prefix='_f(x,y,z)='
            parentId={this.props.id}
          />
          <StaticMathStyled latex='='/>
          <MathInputRHS
            field='rhs'
            // that lhs and rhs have same prefix name is irrelevant.
            // So far we've used f(...) as a function prefix everywhere.
            prefix='_f(x,y,z)='
            parentId={this.props.id}
          />
        </MainRow>
        {/* Maybe better to put all of the ranges on one row.  */}
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
  type: IMPLICIT_SURFACE,
  description: 'Implicit Surface',
  metadata: implicitSurfaceMeta,
  uiComponent: ImplicitSurfaceUI,
  mathboxComponent: ImplicitSurfaceGraphic,
  support: 'experimental'
} )

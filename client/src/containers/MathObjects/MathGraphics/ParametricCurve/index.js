// @flow
import React, { PureComponent } from 'react'
import { ParametricCurve as ParametricCurveGraphic } from '../../../../components/MathBox'
import MathGraphic from '../MathGraphic'
import MathGraphicUI from '../containers/MathGraphicUI'
import { parametricCurveMeta } from '../metadata'
import { MainRow } from '../../../../containers/MathObjects/components'
import {
  MathInputRHS,
  StaticMathStyled
} from '../../../../containers/MathObjects/containers/MathInput'

export const PARAMETRIC_CURVE = 'PARAMETRIC_CURVE'

type Props = {
  id: string
}

const justifyRight = {
  justifyContent: 'flex-end'
}
const rangeStyle = {
  flex: 0
}

export class ParemetricCurveUI extends PureComponent<Props> {

  render() {
    return (
      <MathGraphicUI
        type={PARAMETRIC_CURVE}
        id={this.props.id}
        metadata={parametricCurveMeta}>
        <MainRow>
          <MathInputRHS
            field='expr'
            prefix='_f(t)='
            parentId={this.props.id}
          />
        </MainRow>
        <MainRow style={justifyRight}>
          <StaticMathStyled latex='t\in' size='small'/>
          <MathInputRHS
            size='small'
            parentId={this.props.id}
            field='range'
            style={rangeStyle}
          />
        </MainRow>
      </MathGraphicUI>
    )
  }

}

export default new MathGraphic( {
  type: PARAMETRIC_CURVE,
  description: 'Parametric Curve',
  metadata: parametricCurveMeta,
  uiComponent: ParemetricCurveUI,
  mathboxComponent: ParametricCurveGraphic
} )

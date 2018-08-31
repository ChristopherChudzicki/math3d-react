// @flow
import React, { PureComponent } from 'react'
import { ParametricCurve as ParametricCurveGraphic } from 'components/MathBox'
import MathGraphic from '../MathGraphic'
import MathGraphicUI from 'containers/MathObjects/MathGraphics/MathGraphicUI'
import { parametricCurveMeta } from '../metadata'
import { MainRow } from 'containers/MathObjects/components'
import {
  MathInputRHS,
  StaticMathStyled
} from 'containers/MathObjects/containers/MathInput'

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
        mainPrefix='f(t)='
        mainField={'expr'}
        metadata={parametricCurveMeta}>
        <MainRow style={justifyRight}>
          <StaticMathStyled latex='t\in'/>
          <MathInputRHS
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
  metadata: parametricCurveMeta,
  uiComponent: ParemetricCurveUI,
  mathboxComponent: ParametricCurveGraphic
} )

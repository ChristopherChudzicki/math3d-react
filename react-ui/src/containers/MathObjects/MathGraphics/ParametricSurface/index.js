// @flow
import React, { PureComponent } from 'react'
import {
  ParametricSurface as ParametricSurfaceGraphic,
  ExplicitSurface as ExplicitSurfaceGraphic,
  ExplicitSurfacePolar as ExplicitSurfacePolarGraphic
} from 'components/MathBox'
import MathGraphic from '../MathGraphic'
import MathGraphicUI from '../containers/MathGraphicUI'
import {
  parametricSurfacaMeta,
  explicitSurfaceMeta,
  explicitSurfacePolarMeta
} from '../metadata'
import type { MetaData } from '../types'
import { MainRow } from 'containers/MathObjects/components'
import {
  MathInputRHS,
  StaticMathStyled
} from 'containers/MathObjects/containers/MathInput'
import { parser } from 'constants/parsing'

type Props = {
  id: string
}

const justifyRight = {
  justifyContent: 'flex-end'
}
const rangeStyle = {
  flex: 0
}

function makeStripFuncPrefix(varname: string) {
  const prefixLength = `_f(${varname})=`.length
  return function stripFuncPrefixIfPossible(latex: string): string {
    try {
      const full = parser.parse(latex)
      if (full.tree.type !== 'FunctionAssignmentNode') {
        return latex
      }
      const varname = full.tree.params[0]
      const texRHS = latex.slice(prefixLength)
      const rhs = parser.parse(texRHS)
      return rhs.dependencies.has(varname) ? latex : texRHS
    }
    catch (error) {
      return latex
    }
  }
}

function makeSurfaceComponent(type: string, meta: MetaData, labelU: string, labelV: string) {

  const stripFuncPrefixIfPossibleU = makeStripFuncPrefix(labelU)
  const stripFuncPrefixIfPossibleV = makeStripFuncPrefix(labelV)

  return class ParametricSurfaceUI extends PureComponent<Props> {

    render() {
      return (
        <MathGraphicUI
          type={type}
          id={this.props.id}
          metadata={meta}>
          <MainRow>
            <MathInputRHS
              field='expr'
              prefix={`_f(${labelU},${labelV})=`}
              parentId={this.props.id}
            />
          </MainRow>
          <MainRow style={justifyRight}>
            <StaticMathStyled latex={`${labelU}\\in`} size='small'/>
            <MathInputRHS
              size='small'
              parentId={this.props.id}
              prefix={`_f(${labelV})=`}
              postProcessLaTeX={stripFuncPrefixIfPossibleV}
              field='rangeU'
              style={rangeStyle}
            />
          </MainRow>
          <MainRow style={justifyRight}>
            <StaticMathStyled latex={`${labelV}\\in`} size='small'/>
            <MathInputRHS
              size='small'
              parentId={this.props.id}
              prefix={`_f(${labelU})=`}
              postProcessLaTeX={stripFuncPrefixIfPossibleU}
              field='rangeV'
              style={rangeStyle}
            />
          </MainRow>
        </MathGraphicUI>
      )
    }

  }
}

export const PARAMETRIC_SURFACE = 'PARAMETRIC_SURFACE'
export const EXPLICIT_SURFACE = 'EXPLICIT_SURFACE'
export const EXPLICIT_SURFACE_POLAR = 'EXPLICIT_SURFACE_POLAR'

export const ParametricSurface = new MathGraphic( {
  type: PARAMETRIC_SURFACE,
  description: 'Parametric Surface',
  metadata: parametricSurfacaMeta,
  uiComponent: makeSurfaceComponent(PARAMETRIC_SURFACE, parametricSurfacaMeta, 'u', 'v'),
  mathboxComponent: ParametricSurfaceGraphic
} )

export const ExplicitSurface = new MathGraphic( {
  type: EXPLICIT_SURFACE,
  description: 'Explicit Surface',
  metadata: explicitSurfaceMeta,
  uiComponent: makeSurfaceComponent(EXPLICIT_SURFACE, explicitSurfaceMeta, 'x', 'y'),
  mathboxComponent: ExplicitSurfaceGraphic
} )

export const ExplicitSurfacePolar = new MathGraphic( {
  type: EXPLICIT_SURFACE_POLAR,
  description: 'Explicit Surface (Polar)',
  metadata: explicitSurfacePolarMeta,
  uiComponent: makeSurfaceComponent(EXPLICIT_SURFACE_POLAR, explicitSurfacePolarMeta, 'r', '\\theta'),
  mathboxComponent: ExplicitSurfacePolarGraphic
} )

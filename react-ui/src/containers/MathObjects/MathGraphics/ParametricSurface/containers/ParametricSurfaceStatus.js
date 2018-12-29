// @flow
import React from 'react'
import { connect } from 'react-redux'
import EvaluatedStatusSymbol from 'containers/MathObjects/MathGraphics/containers/EvaluatedStatusSymbol'
import { colors, colorMaps } from 'constants/colors'
import { Tabs } from 'antd'
import {
  StaticMathStyled,
  MathInputRHS
} from 'containers/MathObjects/containers/MathInput'
import { ColorScale } from './components/ColorScale'

const TabPane = Tabs.TabPane

const extendedColors = [...colors, ...Object.keys(colorMaps)]

type StatusProps = {
  id: string,
  color: string,
  labelU: string,
  labelV: string
}

function _ParametricSurfaceStatus(props: StatusProps) {
  const { id, color, labelU, labelV } = props
  return (
    <EvaluatedStatusSymbol
      colors={extendedColors}
      id={id}
      extraTabs={
        <TabPane tab='Color Map' key='colorMap'>
          <ColorScale color={color}/>
          <p>
            <StaticMathStyled latex={`f(X, Y, Z, ${labelU}, ${labelV})=`}/>
          </p>
          <MathInputRHS
            parentId={id}
            field='colorExpr'
            prefix={`_f(X, Y, Z, ${labelU}, ${labelV})=`}
          />
          <p>Note: The values X, Y, Z represent scaled axis coordinates, and range from 0 to 1.</p>
        </TabPane>
      }
    />
  )
}

const mapStateToProps = ( { mathGraphics }, ownProps) => ( {
  color: mathGraphics[ownProps.id].color
} )

const ParametricSurfaceStatus = connect(mapStateToProps)(_ParametricSurfaceStatus)
export default ParametricSurfaceStatus

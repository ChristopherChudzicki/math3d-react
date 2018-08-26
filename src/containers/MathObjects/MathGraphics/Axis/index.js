// @flow
import React, { PureComponent } from 'react'
import { Axis as AxisGraphic } from 'components/MathBox'
import MathGraphic from '../MathGraphic'
import MathGraphicUI from 'containers/MathObjects/MathGraphics/MathGraphicUI'
import { axisMeta } from '../metadata'
import {
  MathInputRHS,
  ConnectedStaticMath
} from 'containers/MathObjects/containers/MathInput'
import styled from 'styled-components'

export const AXIS = 'AXIS'

type Props = {
  id: string
}

const noFlex = {
  flex: 0
}

const Cell = styled.div`
  display: flex;
  flex: 1;
  align-items:center;
`
const Label = styled.span`
  padding-left:5px;
  padding-right:5px;
`

export class AxisUI extends PureComponent<Props> {

  render() {
    return (
      <MathGraphicUI
        type={AXIS}
        id={this.props.id}
        metadata={axisMeta}
      >
        <Cell>
          <Label>Direction:</Label>
          <ConnectedStaticMath parentId={this.props.id} field='axis' />
        </Cell>
        <Cell>
          <Label>Min:</Label>
          <MathInputRHS field='min' parentId={this.props.id} style={noFlex}/>
        </Cell>
        <Cell>
          <Label>Max:</Label>
          <MathInputRHS field='max' parentId={this.props.id} style={noFlex} />
        </Cell>

      </MathGraphicUI>
    )
  }

}

export default new MathGraphic( {
  type: AXIS,
  metadata: axisMeta,
  uiComponent: AxisUI,
  mathboxComponent: AxisGraphic
} )

// @flow
import React, { PureComponent } from 'react'
import { Axis as AxisGraphic } from 'components/MathBox'
import MathGraphic from '../MathGraphic'
import MathGraphicUI from '../containers/MathGraphicUI'
import { axisMeta } from '../metadata'
import {
  MathInputRHS,
  ConnectedStaticMath
} from 'containers/MathObjects/containers/MathInput'
import { MainRow, Cell, Label } from 'containers/MathObjects/components'

export const AXIS = 'AXIS'

type Props = {
  id: string
}

const noFlex = {
  flex: 0
}

export class AxisUI extends PureComponent<Props> {

  render() {
    return (
      <MathGraphicUI
        type={AXIS}
        id={this.props.id}
        metadata={axisMeta}
        isDeleteable={false}
      >
        <MainRow>
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
        </MainRow>
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

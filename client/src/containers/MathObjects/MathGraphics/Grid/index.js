// @flow
import React, { PureComponent } from 'react'
import { Grid as GridGraphic } from '../../../../components/MathBox'
import MathGraphic from '../MathGraphic'
import MathGraphicUI from '../containers/MathGraphicUI'
import { gridMeta } from '../metadata'
import {
  ConnectedStaticMath
} from '../../../../containers/MathObjects/containers/MathInput'
import styled from 'styled-components'
import { MainRow } from '../../../../containers/MathObjects/components'

export const GRID = 'GRID'

type Props = {
  id: string
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

export class GridUI extends PureComponent<Props> {

  render() {
    return (
      <MathGraphicUI
        type={GRID}
        id={this.props.id}
        metadata={gridMeta}
        isDeleteable={false}
      >
        <MainRow>
          <Cell>
            <Label>Axes:</Label>
            <ConnectedStaticMath parentId={this.props.id} field='axes' />
          </Cell>
        </MainRow>
      </MathGraphicUI>
    )
  }

}

export default new MathGraphic( {
  type: GRID,
  metadata: gridMeta,
  uiComponent: GridUI,
  mathboxComponent: GridGraphic
} )

// @flow
import React, { PureComponent } from 'react'
import { Line as LineGraphic } from '../../../../components/MathBox'
import MathGraphic from '../MathGraphic'
import MathGraphicUI from '../containers/MathGraphicUI'
import { lineMeta } from '../metadata'
import { MainRow } from '../../../../containers/MathObjects/components'
import { MathInputRHS } from '../../../../containers/MathObjects/containers/MathInput'

export const LINE = 'LINE'

type Props = {
  id: string
}

export class LineUI extends PureComponent<Props> {

  render() {
    return (
      <MathGraphicUI
        type={LINE}
        id={this.props.id}
        metadata={lineMeta}>
        <MainRow>
          <MathInputRHS parentId={this.props.id} field='coords'/>
        </MainRow>
      </MathGraphicUI>
    )
  }

}

export default new MathGraphic( {
  type: LINE,
  metadata: lineMeta,
  uiComponent: LineUI,
  mathboxComponent: LineGraphic
} )

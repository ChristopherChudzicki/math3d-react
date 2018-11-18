// @flow
import React, { PureComponent } from 'react'
import { Camera as CameraGraphic } from 'components/MathBox'
import MathGraphic from '../MathGraphic'
import MathObjectUI from 'containers/MathObjects/MathObjectUI'
import { cameraMeta } from '../metadata'
import {
  ConnectedStaticMath
} from 'containers/MathObjects/containers/MathInput'
import { MainRow, Cell, Label } from 'containers/MathObjects/components'

export const CAMERA = 'CAMERA'

type Props = {
  id: string
}

export class CameraUI extends PureComponent<Props> {

  render() {
    return (
      <MathObjectUI
        type={CAMERA}
        id={this.props.id}
        metadata={cameraMeta}
        isDeleteable={false}
      >
        <MainRow>
          <p><em>(Coordinates relative to axes)</em></p>
        </MainRow>
        <MainRow>
          <Cell>
            <Label>Position:</Label>
            <ConnectedStaticMath parentId={this.props.id} field='relativePosition' />
          </Cell>
        </MainRow>
        <MainRow>
          <Cell>
            <Label>Look At:</Label>
            <ConnectedStaticMath parentId={this.props.id} field='relativeLookAt' />
          </Cell>
        </MainRow>
      </MathObjectUI>
    )
  }

}

export default new MathGraphic( {
  type: CAMERA,
  metadata: cameraMeta,
  uiComponent: CameraUI,
  mathboxComponent: CameraGraphic
} )

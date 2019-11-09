// @flow
import React, { PureComponent } from 'react'
import { Camera as CameraGraphic } from 'components/MathBox'
import MathGraphic from '../MathGraphic'
import MathObjectUI from 'containers/MathObjects/MathObjectUI'
import { cameraMeta } from '../metadata'
import { MathInputRHS } from 'containers/MathObjects/containers/MathInput'
import ToggleSwitch from 'containers/MathObjects/containers/ToggleSwitch'
import { MainRow, Cell, Label } from 'containers/MathObjects/components'
import UseComputedToggle from './UseComputedToggle'
import styled from 'styled-components'
import typeof { setProperty } from 'containers/MathObjects/actions'

const IndentedRow = styled(MainRow)`
  padding-left:20px;
  padding-right:30px;
`

export const CAMERA = 'CAMERA'

type Props = {
  id: string,
  isRotateEnabled: boolean,
  isZoomEnabled: boolean,
  isPanEnabled: boolean,
  useComputed: boolean,
  setProperty: setProperty
}

export class CameraUI extends PureComponent<Props> {

  render() {
    const { id } = this.props
    return (
      <MathObjectUI
        type={CAMERA}
        id={id}
        metadata={cameraMeta}
        isDeleteable={false}
      >
        <MainRow>
          <Cell>
            <Label>User-Controlled Camera:</Label>
          </Cell>
        </MainRow>
        <IndentedRow>
          <Cell>
            <Label>Rotate:</Label>
            <ToggleSwitch
              parentId={id}
              field='isRotateEnabled'
              disabledField='useComputed'
              size='small'
              checkedChildren='on'
              unCheckedChildren='off'
            />
          </Cell>
          <Cell>
            <Label>Zoom:</Label>
            <ToggleSwitch
              parentId={id}
              field='isZoomEnabled'
              disabledField='useComputed'
              size='small'
              checkedChildren='on'
              unCheckedChildren='off'
            />
          </Cell>
          <Cell>
            <Label>Pan:</Label>
            <ToggleSwitch
              parentId={id}
              field='isPanEnabled'
              disabledField='useComputed'
              size='small'
              checkedChildren='on'
              unCheckedChildren='off'
            />
          </Cell>
        </IndentedRow>
        <MainRow>
          <Cell>
            <Label>Computed Camera:</Label>
            {/* $FlowFixMe trouble with connect */}
            <UseComputedToggle
              parentId={id}
              size='small'
              checkedChildren='on'
              unCheckedChildren='off'
            />
          </Cell>
        </MainRow>
        <IndentedRow>
          <Cell>
            <Label>Position:</Label>
            <MathInputRHS parentId={this.props.id} field='computedPosition'/>
          </Cell>
        </IndentedRow>
        <IndentedRow>
          <Cell>
            <Label>Look At:</Label>
            <MathInputRHS parentId={this.props.id} field='computedLookAt'/>
          </Cell>
        </IndentedRow>
        <MainRow>
          <Cell>
            <Label>
              Use Orthographic Projection:
            </Label>
            <ToggleSwitch
              parentId={id}
              field='isOrthographic'
              size='small'
              checkedChildren='on'
              unCheckedChildren='off'
            />
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

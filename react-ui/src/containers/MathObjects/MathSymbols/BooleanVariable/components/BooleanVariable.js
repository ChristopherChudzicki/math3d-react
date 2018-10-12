// @flow
import React, { PureComponent } from 'react'
import { Switch } from 'antd'
import MathObjectUI from 'containers/MathObjects/MathObjectUI'
import { MainRow } from 'containers/MathObjects/components'
import {
  MathInputLHS
} from 'containers/MathObjects/containers/MathInput'
import { BOOLEAN_VARIABLE } from '../metadata'
import typeof { setProperty } from 'containers/MathObjects/actions'

type Props = {
  id: string,
  setProperty: setProperty,
  value: bool
}

export default class BooleanVariable extends PureComponent<Props> {

  onChange = (value: bool) => {
    this.props.setProperty(this.props.id, BOOLEAN_VARIABLE, 'value', value)
  }

  render() {
    return (
      <MathObjectUI
        id={this.props.id}
        type={BOOLEAN_VARIABLE}
      >
        <MainRow>
          <MathInputLHS
            parentId={this.props.id}
          />
          <Switch
            checkedChildren='On'
            unCheckedChildren='Off'
            checked={this.props.value}
            onChange={this.onChange}
          />
        </MainRow>
      </MathObjectUI>
    )
  }

}

// @flow
import typeof { Component, PureComponent } from 'react'
import type { Node } from 'react'
type InputType = 'math' | 'boolean' | 'text'

type Setting = {
  property: string,
  inputType: InputType,
  label: ?string,
  isPrimary: ?boolean,
  defaultValue: any,
  generateRandomValue: () => any
}

export type SettingsList = Array<Setting>

type FunctionalComponent = ( { [prop: string]: any } ) => Node

export type MathGraphic = {
  type: string,
  settingsList: SettingsList,
  interfaceComponent: Component | PureComponent | FunctionalComponent,
  mathboxComponent: Component | PureComponent | FunctionalComponent
}

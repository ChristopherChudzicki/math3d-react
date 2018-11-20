// @flow
import typeof { Component, PureComponent } from 'react'
import type { Node } from 'react'

export type InputType = 'math' | 'boolean' | 'text' | 'numericArray'
type InputTypeData =
  | {
      inputType: 'math',
      defaultValue: string,
      generateRandomValue?: () => string
    }
  | {
      inputType: 'boolean',
      defaultValue: bool,
      generateRandomValue?: () => bool
    }
  | {
      inputType: 'text',
      defaultValue: string,
      generateRandomValue?: () => string
    }
    // numericArray inputType is only used by Camera component, and it's not
    // really an inputType because users cannot edit it... hacky
  | {
      inputType: 'numericArray',
      defaultValue: Array<number>,
      isPrimary: true, // prevents numericArray from appearing in settings
      generateRandomValue?: () => Array<number>
    }

export type MetaData = {
  [property: string]: InputTypeData & {
    label?: string,
    isPrimary?: boolean,
    allowEmpty?: boolean
  }
}

type FunctionalComponent = ( { [prop: string]: any } ) => Node

export type MathGraphic = {
  type: string,
  metadata: MetaData,
  uiComponent: Component | PureComponent | FunctionalComponent,
  mathboxComponent: Component | PureComponent | FunctionalComponent
}

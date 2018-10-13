// @flow
import typeof { Component, PureComponent } from 'react'
import type { Node } from 'react'

export type InputType = 'math' | 'boolean' | 'text'
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

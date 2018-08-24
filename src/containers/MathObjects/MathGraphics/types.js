// @flow
import typeof { Component, PureComponent } from 'react'
import type { Node } from 'react'

export type InputType = 'math' | 'boolean' | 'text'

export type MetaData = {
  [property: string]: {|
    inputType: InputType,
    label?: string,
    isPrimary?: boolean,
    defaultValue: any,
    generateRandomValue?: () => any
  |}
}

type FunctionalComponent = ( { [prop: string]: any } ) => Node

export type MathGraphic = {
  type: string,
  metadata: MetaData,
  uiComponent: Component | PureComponent | FunctionalComponent,
  mathboxComponent: Component | PureComponent | FunctionalComponent
}

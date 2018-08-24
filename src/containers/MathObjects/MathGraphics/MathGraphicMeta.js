// @flow
import type { MetaData } from './types'
import typeof { Component, PureComponent } from 'react'
import type { Node } from 'react'
import { capitalize } from 'utils/helpers'

type FunctionalComponent = ( { [prop: string]: any } ) => Node
type ReactComponent = Component | PureComponent | FunctionalComponent

/**
 * Contains metadata about MathGraphic and coerces it into a form consumable
 * by other sources
 */
export default class MathGraphic {

  type: string
  defaults: { [property: string]: any }
  uiComponent: ReactComponent
  mathboxComponent: ReactComponent
  computedProps: Array<string>

  constructor( { type, description, metadata, uiComponent, mathboxComponent }: {
    type: string,
    description?: string,
    metadata: MetaData,
    uiComponent: ReactComponent,
    mathboxComponent: ReactComponent
  } ) {
    this.type = type
    this.uiComponent = uiComponent
    this.mathboxComponent = mathboxComponent
    this.defaults = MathGraphic.getDefaults(type, metadata, description)
    this.computedProps = Object.keys(metadata)
      .filter(key => metadata[key].inputType === 'math')
  }

  static getDefaults(type: string, metadata: MetaData, description: ?string) {
    const initial = { type, description: description || capitalize(type) }
    return Object.keys(metadata).reduce((acc, property) => {
      acc[property] = metadata[property]
      return acc
    }, initial)
  }

}

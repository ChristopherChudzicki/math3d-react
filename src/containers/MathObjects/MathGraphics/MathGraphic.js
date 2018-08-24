// @flow
import type { MetaData } from './types'
import { capitalize } from 'utils/helpers'
import type { MathObjectWrapper } from '../MathObject'

/**
 * Contains metadata about MathGraphic and coerces it into a form consumable
 * by other sources
 */
export default class MathGraphic implements MathObjectWrapper {

  type: string
  defaultSettings: { [property: string]: any }
  uiComponent: Function
  mathboxComponent: Function
  computedProps: Array<string>
  reducer = 'mathGraphics'

  constructor( { type, description, metadata, uiComponent, mathboxComponent }: {
    type: string,
    description?: string,
    metadata: MetaData,
    uiComponent: Function,
    mathboxComponent: Function
  } ) {
    this.type = type
    this.uiComponent = uiComponent
    this.mathboxComponent = mathboxComponent
    this.defaultSettings = MathGraphic.getDefaultSettings(type, metadata, description)
    this.computedProps = Object.keys(metadata)
      .filter(key => metadata[key].inputType === 'math')
  }

  static getDefaultSettings(type: string, metadata: MetaData, description: ?string) {
    const initial = { type, description: description || capitalize(type) }
    return Object.keys(metadata).reduce((acc, property) => {
      acc[property] = metadata[property]
      return acc
    }, initial)
  }

}

// @flow

export type Settings = { [property: string]: any, description: string }

/**
 * @module MathObject
 * Defines wrapper objects that contains react component and metadata
 *
 * Three types of MathObjects:
 * - Folder: wrapper defiend here
 * - Symbol: wrapped defined here
 * - Graphic: wrapped defined in ./MathGraphics
 */

type Config = {
  type: string,
  defaultSettings: Settings,
  uiComponent: Function
}

export interface MathObjectWrapper {
  type: string,
  defaultSettings: Settings,
  uiComponent: Function,
  reducer: string
}

export class MathFolder implements MathObjectWrapper {

  type: string
  defaultSettings: Settings
  uiComponent: Function
  reducer = 'folders'

  constructor(config: Config) {
    Object.assign(this, config)
  }

}

export class MathSymbol implements MathObjectWrapper {

  type: string
  defaultSettings: Settings
  uiComponent: Function
  reducer = 'mathSymbols'

  constructor(config: Config) {
    Object.assign(this, config)
  }

}

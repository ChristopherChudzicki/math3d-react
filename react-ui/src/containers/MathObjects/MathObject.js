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

export type Support = 'full' | 'experimental' | 'deprecationWarning'

type Config = {
  type: string,
  defaultSettings: Settings,
  uiComponent: Function,
  support?: Support
}

export interface MathObjectWrapper {
  type: string,
  defaultSettings: Settings,
  uiComponent: Function,
  reducer: string,
  support: Support
}

export class MathFolder implements MathObjectWrapper {

  type: string
  defaultSettings: Settings
  uiComponent: Function
  reducer = 'folders'
  support: Support

  constructor(config: Config) {
    if (!config.support) {
      config.support = 'full'
    }
    Object.assign(this, config)
  }

}

export class MathSymbol implements MathObjectWrapper {

  type: string
  defaultSettings: Settings
  uiComponent: Function
  reducer = 'mathSymbols'
  support: Support

  constructor(config: Config) {
    if (!config.support) {
      config.support = 'full'
    }
    Object.assign(this, config)
  }

}

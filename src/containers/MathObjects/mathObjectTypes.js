export const FOLDER = 'FOLDER'
export const POINT = 'POINT'
export const VARIABLE = 'VARIABLE'

export const mapTypeToState = {
  [FOLDER]: 'folders',
  [POINT]: 'mathGraphics',
  [VARIABLE]: 'mathSymbols'
}

export const mathObjectTypes = Object.keys(mapTypeToState)

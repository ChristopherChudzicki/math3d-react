export const FOLDER = 'FOLDER'
export const POINT = 'POINT'

export const mapTypeToState = {
  [FOLDER]: 'folders',
  [POINT]: 'points'
}

export const mathObjectTypes = Object.keys(mapTypeToState)

// @flow
import Folder from './Folder'
import MathGraphics from './MathGraphics'
import MathSymbols from './MathSymbols'

export { Folder, MathGraphics, MathSymbols }

export default {
  [Folder.type]: Folder,
  ...MathSymbols,
  ...MathGraphics
}

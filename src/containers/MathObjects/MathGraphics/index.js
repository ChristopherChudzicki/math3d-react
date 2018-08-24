// @flow
import type MathGraphic from './MathGraphic'
import Point from './Point'
import Line from './Line'

function makeExports(mathGraphics: Array<MathGraphic>) {
  return mathGraphics.reduce((acc, obj) => {
    acc[obj.type] = obj
    return acc
  }, {} )
}

export default makeExports( [
  Point,
  Line
] )

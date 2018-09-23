// @flow
import type MathGraphic from './MathGraphic'
import Point from './Point'
import Line from './Line'
import Vector from './Vector'
import Axis from './Axis'
import Grid from './Grid'
import ParametricCurve from './ParametricCurve'

function makeExports(mathGraphics: Array<MathGraphic>) {
  return mathGraphics.reduce((acc, obj) => {
    acc[obj.type] = obj
    return acc
  }, {} )
}

export default makeExports( [
  Axis,
  Grid,
  Point,
  Line,
  Vector,
  ParametricCurve
] )

export { AXIS } from './Axis'
export { GRID } from './Grid'
export { POINT } from './Point'
export { LINE } from './Line'
export { VECTOR } from './Vector'
export { PARAMETRIC_CURVE } from './ParametricCurve'

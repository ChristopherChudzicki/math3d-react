// @flow
import type MathGraphic from './MathGraphic'
import Point from './Point'
import Line from './Line'
import Vector from './Vector'
import Axis from './Axis'
import Grid from './Grid'
import ParametricCurve from './ParametricCurve'
import {
  ParametricSurface,
  ExplicitSurface,
  ExplicitSurfacePolar
} from './ParametricSurface'
import ImplicitSurface from './ImplicitSurface'
import VectorField from './VectorField'

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
  ParametricCurve,
  ParametricSurface,
  ExplicitSurface,
  ExplicitSurfacePolar,
  ImplicitSurface,
  VectorField
] )

export { AXIS } from './Axis'
export { GRID } from './Grid'
export { POINT } from './Point'
export { LINE } from './Line'
export { VECTOR } from './Vector'
export { PARAMETRIC_CURVE } from './ParametricCurve'
export {
  PARAMETRIC_SURFACE,
  EXPLICIT_SURFACE,
  EXPLICIT_SURFACE_POLAR
} from './ParametricSurface'
export { IMPLICIT_SURFACE } from './ImplicitSurface'
export { VECTOR_FIELD } from './VectorField'

import { triangleTable } from './triangleTable'

/**
 * Interpolation
 *
 * Interpolates to find the value of x that makes
 * f(x) == c, assuming that a is f(x1), b is f(x2)
 * and c is between a and b.
 */
function interp(x1, x2, a, b, c) {
  const t = (c - a) / (b - a)
  return x1 * (1 - t) + x2 * t
}

class MarchingCube {

  constructor(x, y, z, xStep, yStep, zStep, func, c) {
    this.x = x
    this.y = y
    this.z = z
    this.xStep = xStep
    this.yStep = yStep
    this.zStep = zStep
    this.c = c
    this.v1 = func(x, y, z)
    this.v2 = func(x+xStep, y, z)
    this.v4 = func(x+xStep, y, z+zStep)
    this.v8 = func(x, y, z+zStep)
    this.v16 = func(x, y+yStep, z)
    this.v32 = func(x+xStep, y+yStep, z)
    this.v64 = func(x+xStep, y+yStep, z+zStep)
    this.v128 = func(x, y+yStep, z+zStep)
    this.edgePoints = new Map()
  }

  /**
   * getIndex
   *
   * Return the index into the 256 value lookup table
   */
  getIndex() {
    let index = 0
    const values = [
      this.v1, this.v2, this.v4, this.v8,
      this.v16, this.v32, this.v64, this.v128
    ]
    for (let i = 0; i < values.length; i++) {
      const bit = 2**i
      index += (values[i] > this.c) * bit
    }
    return index
  }

  getEdgePoint(edgeIndex) {
    if (this.edgePoints.has(edgeIndex)) {
      return this.edgePoints.get(edgeIndex)
    }
    let x, y, z
    switch (edgeIndex) {

      // See edge numbers here: http://paulbourke.net/geometry/polygonise/
      case 0:
        x = interp(this.x, this.x+this.xStep, this.v1, this.v2, this.c)
        y = this.y
        z = this.z
        break
      case 1:
        x = this.x + this.xStep
        y = this.y
        z = interp(this.z, this.z+this.zStep, this.v2, this.v4, this.c)
        break
      case 2:
        x = interp(this.x, this.x+this.xStep, this.v8, this.v4, this.c)
        y = this.y
        z = this.z + this.zStep
        break
      case 3:
        x = this.x
        y = this.y
        z = interp(this.z, this.z+this.zStep, this.v1, this.v8, this.c)
        break
      case 4:
        x = interp(this.x, this.x+this.xStep, this.v16, this.v32, this.c)
        y = this.y + this.yStep
        z = this.z
        break
      case 5:
        x = this.x + this.xStep
        y = this.y + this.yStep
        z = interp(this.z, this.z+this.zStep, this.v32, this.v64, this.c)
        break
      case 6:
        x = interp(this.x, this.x+this.xStep, this.v128, this.v64, this.c)
        y = this.y + this.yStep
        z = this.z + this.zStep
        break
      case 7:
        x = this.x
        y = this.y + this.yStep
        z = interp(this.z, this.z+this.zStep, this.v16, this.v128, this.c)
        break
      case 8:
        x = this.x
        y = interp(this.y, this.y+this.yStep, this.v1, this.v16, this.c)
        z = this.z
        break
      case 9:
        x = this.x + this.xStep
        y = interp(this.y, this.y+this.yStep, this.v2, this.v32, this.c)
        z = this.z
        break
      case 10:
        x = this.x + this.xStep
        y = interp(this.y, this.y+this.yStep, this.v4, this.v64, this.c)
        z = this.z + this.zStep
        break
      case 11:
        x = this.x
        y = interp(this.y, this.y+this.yStep, this.v8, this.v128, this.c)
        z = this.z + this.zStep
        break
      default:
        throw new Error('Edge index must be between 0 and 11')

    }
    this.edgePoints.set(edgeIndex, [x, y, z] )
    return [x, y, z]
  }

}

export default function marchingCubes(
  xMin, xMax, yMin, yMax, zMin, zMax,
  func, c = 0, resolution = 128
) {
  const xStep = (xMax - xMin) / resolution
  const yStep = (yMax - yMin) / resolution
  const zStep = (zMax - zMin) / resolution
  const finalTriangles = []
  for (let x = xMin; x < xMax; x += xStep) {
    for (let y = yMin; y < yMax; y += yStep) {
      for (let z = zMin; z < zMax; z += zStep) {
        // Same order as on http://paulbourke.net/geometry/polygonise/
        const cube = new MarchingCube(x, y, z, xStep, yStep, zStep, func, c)
        const cubeCase = triangleTable[cube.getIndex()]
        for (let i = 0; i < cubeCase.length; i++) {
          const triangle = cubeCase[i]
          finalTriangles.push( [
            cube.getEdgePoint(triangle[0] ),
            cube.getEdgePoint(triangle[1] ),
            cube.getEdgePoint(triangle[2] )
          ] )
        }
      }
    }
  }
  return finalTriangles
}

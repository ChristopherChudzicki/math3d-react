# Change Log

## Version 1.2

## Version 1.2.8
 - Fixed https://github.com/ChristopherChudzicki/math3d-react/issues/250
 - Fixed a bug where vector-valued functions sometimes erroneously displayed errors that they had the incorrect number of outputs. This happened with functions that sometimes sampled to complex values, and could cause problems loading graphs.

## Version 1.2.7
 - Fixed a bug where newly created folders, if saved in their default state
   (default title and open) would prevent the saved graph from loading properly.
 - Fixed a bug where Share button's "Copied!" status was not resetting properly.

## Version 1.2.6
 - Math3d.org will now prompt users to confirm when leaving the site if their
   visualization has not been saved, or if they have loaded a previously saved
   visualization and have made meaningful changes to it.

## Version 1.2.5
 - added an Orthographic option for the camera.
   
   Note: Due to a bug in MathBox, this is not a true orthographic camera, but
   a perspective camera dollied way out, and zoomed way in ("dolly zoom"), which
   mimics the effect of an orthographic camera.

## Version 1.2.4
  - added hyperbolic trig functions and their inverses, `cosh`, `sinh`, `tanh`, `arccosh`, `arcsinh`, `arctanh`.

## Version 1.2.3
  - Fix a bug where vector fields and implicit surfaces would throw errors if an expression named "f(...)" was used as the right-hand-side.

## Version 1.2.2
  - Add `pdiff` function with signature `pdiff(f, x, y,..., 1)` for the partial derivative of `f(x, y,...)` with respect to first argument, namely `x`.
  - Add `curl` function that accepts 3-dimensional vector fields `F(x, y, z)` with signature `curl(F, x, y, z)`
  - Add `div` function that accepts vector fields `F(x, y, ...)` with signature `div(F, x, y, ...)`

## Version 1.2.1
  - fixed a bug that caused some successfully loaded graphs to crash when new object added (#200)
  - added inverse trig functions `arctan`, `arcsin`, `arccos`. The `arctan` function can be called with 1 or 2 arguments.
  - fixed a bug that caused some graphs to crash on load (#190)

### Version 1.2.0

 - Updated MathBox to use newer version of ThreeJS. This fixes scrolling/zooming issues in Firefox.
 - Objects are now drawn in order of decreasing opacity
 - Adjusted default width/opacity for axis grids
 - Adjusted default width and zBias for surface gridlines

## Version 1.1.1

  - Updated MathQuill to latest version. This fixes a bug where Android virtual keyboard would not type correctly in MathQuill fields.
  - Fixed a bug where app would crash if last folder was deleted.

## Version 1.1.0

  - Added color maps for Explicit Surfaces and Parametric Surfaces
  - Decreased drawer width when screen size is small
  - Added more examples
  - Decreased CPU usage when no animations are running (achieved by rendering
    30 times fewer frames per second when scene is static)

## Version 1.0.0

  - Initial release

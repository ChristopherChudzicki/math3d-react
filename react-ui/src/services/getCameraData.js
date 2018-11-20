// @flow
export default function() {
  const position: Array<number> = window.mathbox.three.camera.position.toArray()
  const lookAt: Array<number> = window.mathbox.three.controls.center.toArray()
  return { position, lookAt }
}

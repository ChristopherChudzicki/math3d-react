// @flow

import { mathbox } from "../containers/MathBoxScene/components/MathBoxScene.js";

export default function () {
  const position: Array<number> = mathbox.three.camera.position.toArray();
  const lookAt: Array<number> = mathbox.three.controls.center.toArray();
  return { position, lookAt };
}

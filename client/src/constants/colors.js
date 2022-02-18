// @flow

import { Color } from "three/src/math/Color.js";

export const colors = [
  '#33FF00',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#8e44ad',
  '#2c3e50',
  '#f1c40f',
  '#e67e22',
  '#e74c3c',
  '#808080'
]

export const colorMaps = {
  rainbow: {
    css: `background: linear-gradient(
      to right,
      hsl(360, 100%, 50%),
      hsl(300, 100%, 50%),
      hsl(240, 100%, 50%),
      hsl(180, 100%, 50%),
      hsl(120, 100%, 50%),
      hsl(60, 100%, 50%),
      hsl(0, 100%, 50%)
    )
    `,
    func: (frac: number) => {
      const color = new Color(0xffffff)
      color.setHSL(1 - frac, 1, 0.5)
      return [color.r, color.g, color.b, 1.0]
    }
  },
  bluered: {
    css: 'background: linear-gradient(to right, blue, red)',
    func: (frac: number) => {
      return [frac, 0, 1 - frac, 1]
    }
  },
  temperature: {
    css: `background: linear-gradient(
      to right,
      hsl(240, 100%, 50%),
      hsl(180, 100%, 50%),
      hsl(120, 100%, 50%),
      hsl(60, 100%, 50%),
      hsl(0, 100%, 50%)
    )
    `,
    func: (frac: number) => {
      const color = new Color(0xffffff)
      color.setHSL(0.666*(1 - frac), 1, 0.5)
      return [color.r, color.g, color.b, 1.0]
    }
  }
}

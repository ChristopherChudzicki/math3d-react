// @flow
import Color from 'color'

export function lighten(colorStr: string, amount: number) {
  const color = Color(colorStr)
  const lightness = color.lightness()
  const increaseBy = amount * (1 - lightness / 100)
  return color.lighten(increaseBy).hex()
}

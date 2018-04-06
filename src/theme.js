import Color from 'color'

const primary = Color.rgb(64, 169, 255)

export function lighten(colorStr, amount) {
  const color = Color(colorStr)
  const lightness = color.lightness()
  const increaseBy = amount * (1 - lightness / 100)
  return color.lighten(increaseBy).toString()
}

export const theme = {
  primary: primary.toString(),
  primaryLight: primary.lighten(0.3).toString(),
  primaryDark: primary.darken(0.5).toString(),
  light: '#f8f8f8',
  medium: '#bfbfbf',
  dark: '#696969',
  borderRadius: '4px',
  transitionDuration: '0.3s',
  transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1);'
}

export default theme

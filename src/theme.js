import Color from 'color'

const primary = Color.rgb(64, 169, 255)

const theme = {
  primary: primary.toString(),
  primaryLight: primary.lighten(0.3).toString(),
  primaryDark: primary.darken(0.5).toString(),
  light: '#f8f8f8',
  medium: '#bfbfbf',
  dark: '#696969',
  borderRadius: '4px'
}

export default theme

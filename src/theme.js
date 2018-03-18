import Color from 'color'

const primary = Color.ansi256('cornflowerblue')

const theme = {
  primary: primary.toString(),
  primaryLight: primary.lighten(0.5).toString(),
  primaryDark: primary.darken(0.5).toString(),
  light: '#f8f8f8',
  medium: '#bfbfbf',
  dark: 'darkgray'
}

export default theme

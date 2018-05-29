import Color from 'color'

export function lighten(colorStr, amount) {
  const color = Color(colorStr)
  const lightness = color.lightness()
  const increaseBy = amount * (1 - lightness / 100)
  return color.lighten(increaseBy).toString()
}

export const theme = {
  borderRadius: '4px',
  transitionDuration: '300ms',
  transitionDurationMS: 300,
  transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1);',
  // From ant design
  gray: [
    '#ffffff',
    '#fafafa',
    '#f5f5f5',
    '#e8e8e8',
    '#d9d9d9',
    '#bfbfbf',
    '#8c8c8c',
    '#595959',
    '#262626',
    '#000000'
  ],
  // from ant design, daybreak blue
  primary: [
    '#e6f7ff',
    '#bae7ff',
    '#91d5ff',
    '#69c0ff',
    '#40a9ff',
    '#1890ff',
    '#096dd9',
    '#0050b3',
    '#003a8c',
    '#002766'
  ]
}

export default theme

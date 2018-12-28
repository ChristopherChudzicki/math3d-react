// @flow
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
  'rainbow': {
    css: `background: linear-gradient(
      hsl(360, 100%, 50%),
      hsl(300, 100%, 50%),
      hsl(240, 100%, 50%),
      hsl(180, 100%, 50%),
      hsl(120, 100%, 50%),
      hsl(60, 100%, 50%),
      hsl(0, 100%, 50%)
    )
    `
  },
  'bluered': {
    css: 'background: linear-gradient(red, blue)'
  }
}

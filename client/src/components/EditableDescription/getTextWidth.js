// @flow
type GetTextWidth = {
  (text: string, font: string): number,
  canvas?: HTMLCanvasElement
}

export const getTextWidth: GetTextWidth = function getTextWidth(text, font) {
  // from https://stackoverflow.com/a/21015393/2747370
  // re-use canvas object for better performance
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
  const context = canvas.getContext('2d')
  context.font = font
  const metrics = context.measureText(text)
  const roundedWidth = Math.floor(metrics.width) + 1
  return roundedWidth
}

window.getTextWidth = getTextWidth

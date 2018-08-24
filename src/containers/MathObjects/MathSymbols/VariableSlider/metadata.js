export const VARIABLE_SLIDER = 'VARIABLE_SLIDER'
export const defaultValue = 0 // slider value, used by slider reducer
export const defaultSettings = {
  type: VARIABLE_SLIDER,
  name: 'T',
  value: null, // used as valueText ... consider renaming this key
  min: '-5',
  max: '5',
  description: 'Variable Slider'
}

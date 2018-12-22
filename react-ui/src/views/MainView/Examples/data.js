// @flow

export type ExampleItem = {
  id: string,
  title: string,
  description?: string
}

export type Examples = Array<ExampleItem>

export const neatExamples: Examples = [
  {
    id: 'sliders_intro',
    title: 'Using Variable Sliders'
  },
  {
    id: 'sliders_plotrange',
    title: 'Using Sliders to Animate Plot Range'
  }
]

export const featureDemos: Examples = [

]

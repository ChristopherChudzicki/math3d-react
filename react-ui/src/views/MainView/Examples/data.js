// @flow

export type ExampleItem = {
  id: string,
  title: string,
  description?: string
}

export type Examples = Array<ExampleItem>

export const featureDemos: Examples = [
  {
    id: 'sliders_intro',
    title: 'Using Variable Sliders'
  },
  {
    id: 'sliders_plotrange',
    title: 'Using Sliders to Animate Plot Range'
  },
  {
    id: 'color_and_visibility',
    title: 'Color and Visibility'
  },
  {
    id: 'vectors',
    title: 'Vectors and Vector Tails'
  },
  {
    id: 'labels',
    title: 'Labeling Points, Vectors, and Lines'
  },
  {
    id: 'functions',
    title: 'Using Functions'
  },
  {
    id: 'derivatives',
    title: 'diff: Using Derivatives'
  },
  {
    id: 'calculated_visibility',
    title: 'Controlling Multiple Object Visibility with Toggles'
  },
  {
    id: 'z_bias',
    title: 'Fine-tuning Visibility with z-bias'
  },
  {
    id: 'tnb',
    title: 'The TNB Vectors for Parametric Curves'
  },
  {
    id: 'animate_camera',
    title: 'Animating the Camera Position'
  }
]

export const neatExamples: Examples = [
  {
    id: 'motion',
    title: 'Motion: Velocity and Acceleration',
  },
  {
    id: 'ruled_hyperboloid',
    title: 'Ruled Hyperboloid'
  }
]

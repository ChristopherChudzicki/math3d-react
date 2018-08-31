// @flow
import type { MetaData } from './types'

function genDescription(defaultDescription: string) {
  return {
    inputType: 'text',
    defaultValue: defaultDescription,
    isPrimary: true
  }
}

const universal: MetaData = {
  color: {
    inputType: 'text',
    defaultValue: '#3090FF',
    isPrimary: true
  },
  visible: {
    inputType: 'boolean',
    defaultValue: true,
    isPrimary: true
  },
  opacity: {
    inputType: 'math',
    defaultValue: '1'
  },
  zIndex: {
    inputType: 'math',
    defaultValue: '0'
  },
  zBias: {
    inputType: 'math',
    defaultValue: '0'
  }
}

const labeled: MetaData = {
  label: {
    inputType: 'text',
    defaultValue: ''
  },
  labelVisible: {
    inputType: 'boolean',
    defaultValue: false
  }
}

// ---------- Point ---------- //
const axisSpecific: MetaData = {
  min: {
    inputType: 'math',
    defaultValue: '-5',
    isPrimary: true
  },
  max: {
    inputType: 'math',
    defaultValue: '+5',
    isPrimary: true
  },
  axis: {
    inputType: 'text',
    defaultValue: 'x',
    isPrimary: true
  }
}

export const axisMeta: MetaData = {
  ...universal,
  ...labeled,
  ...axisSpecific
}

// ---------- Point ---------- //
const pointSpecific: MetaData = {
  description: genDescription('Point'),
  coords: {
    inputType: 'math',
    defaultValue: '\\left[0,0,0\\right]',
    isPrimary: true
  },
  size: {
    inputType: 'math',
    defaultValue: '16'
  }
}

export const pointMeta: MetaData = {
  ...universal,
  ...labeled,
  ...pointSpecific
}

// ---------- Line ---------- //
const lineLike: MetaData = {
  size: {
    inputType: 'math',
    defaultValue: '16'
  },
  width: {
    inputType: 'math',
    defaultValue: '4'
  },
  start: {
    inputType: 'boolean',
    defaultValue: false
  },
  end: {
    inputType: 'boolean',
    defaultValue: false
  }
}

const lineSpecific: MetaData = {
  description: genDescription('Line'),
  coords: {
    inputType: 'math',
    defaultValue: '\\left[\\left[1,1,1\\right], \\left[-1,1,-1\\right]\\right]',
    isPrimary: true
  }
}

export const lineMeta: MetaData = {
  ...universal,
  ...labeled,
  ...lineLike,
  ...lineSpecific
}

// ---------- Vector ---------- //
const vectorSpecific: MetaData = {
  components: {
    inputType: 'math',
    defaultValue: '\\left[3,2,1\\right]',
    isPrimary: true
  },
  tail: {
    inputType: 'math',
    defaultValue: '\\left[0,0,0\\right]'
  },
  end: {
    inputType: 'boolean',
    defaultValue: true
  }
}

export const vectorMeta: MetaData = {
  ...universal,
  ...labeled,
  ...lineLike,
  ...vectorSpecific
}

// ---------- ParametricCurve Specific ---------- //
const parametricCurveSpecific: MetaData = {
  expr: {
    inputType: 'math',
    defaultValue: 'f(t)=\\left[\\cos\\left(t\\right),\\ \\sin\\left(t\\right),\\ t\\right]',
    isPrimary: true
  },
  range: {
    inputType: 'math',
    defaultValue: '\\left[-2\\pi,\\ 2\\pi\\right]',
    isPrimary: true
  },
  samples: {
    inputType: 'math',
    defaultValue: '128'
  }
}

export const parametricCurveMeta: MetaData = {
  ...universal,
  ...labeled,
  ...lineLike,
  ...parametricCurveSpecific
}

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
    defaultValue: '0',
    label: 'z-index'
  },
  zBias: {
    inputType: 'math',
    defaultValue: '0',
    label: 'z-bias'
  },
  calculatedVisibility: {
    inputType: 'math',
    defaultValue: '',
    allowEmpty: true,
    label: 'calculated visibility'
  }
}

const labeled: MetaData = {
  label: {
    inputType: 'text',
    defaultValue: ''
  },
  labelVisible: {
    inputType: 'boolean',
    defaultValue: false,
    label: 'label visibile'
  }
}

// ---------- Axis ---------- //
const axisSpecific: MetaData = {
  color: {
    inputType: 'text',
    defaultValue: '#808080',
    isPrimary: true
  },
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
  },
  scale: {
    inputType: 'math',
    defaultValue: '1'
  },
  labelVisible: {
    inputType: 'boolean',
    defaultValue: true,
    label: 'label visible'
  },
  ticksVisible: {
    inputType: 'boolean',
    defaultValue: true,
    label: 'ticks visible'
  },
  size: {
    inputType: 'math',
    defaultValue: '2'
  },
  width: {
    inputType: 'math',
    defaultValue: '1'
  }
}

export const axisMeta: MetaData = {
  ...universal,
  ...labeled,
  ...axisSpecific
}

// ---------- Grid ---------- //
const gridSpecific: MetaData = {
  color: {
    inputType: 'text',
    defaultValue: '#808080',
    isPrimary: true
  },
  opacity: {
    inputType: 'math',
    defaultValue: '0.5'
  },
  width: {
    inputType: 'math',
    defaultValue: '1'
  },
  divisions: {
    inputType: 'math',
    defaultValue: '\\left[10,\\ 10\\right]'
  },
  snap: {
    inputType: 'boolean',
    defaultValue: true
  }
}

export const gridMeta: MetaData = {
  ...universal,
  ...gridSpecific
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
    defaultValue: '6'
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

// ---------- ParametricCurve ---------- //
const parametricCurveSpecific: MetaData = {
  expr: {
    inputType: 'math',
    defaultValue: '_f(t)=\\left[\\cos\\left(t\\right),\\ \\sin\\left(t\\right),\\ t\\right]',
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
  ...lineLike,
  ...parametricCurveSpecific
}

// ---------- ParametricSurface ---------- //

const surfaceLike: MetaData = {
  shaded: {
    inputType: 'boolean',
    defaultValue: true
  },
  opacity: {
    inputType: 'math',
    defaultValue: '0.75'
  }
}

function makeParametricSamplesAndGrid(labelU: string, labelV: string) {
  return {
    uSamples: {
      inputType: 'math',
      defaultValue: '64',
      label: `${labelU} samples`
    },
    vSamples: {
      inputType: 'math',
      defaultValue: '64',
      label: `${labelV} samples`
    },
    gridU: {
      inputType: 'math',
      defaultValue: '8',
      label: `${labelU} gridlines`
    },
    gridV: {
      inputType: 'math',
      defaultValue: '8',
      label: `${labelV} gridlines`
    }
  }
}

const parametricSurfacaSpecific: MetaData = {
  expr: {
    inputType: 'math',
    defaultValue: '_f(u,v)=\\left[v\\cdot\\cos\\left(u\\right),v\\cdot\\sin\\left(u\\right),v\\right]',
    isPrimary: true
  },
  rangeU: {
    inputType: 'math',
    defaultValue: '\\left[-\\pi,\\ \\pi\\right]',
    isPrimary: true
  },
  rangeV: {
    inputType: 'math',
    defaultValue: '\\left[-3, 3\\right]',
    isPrimary: true
  },
  gridOpacity: {
    inputType: 'math',
    defaultValue: '0.5'
  },
  gridWidth: {
    inputType: 'math',
    defaultValue: '4'
  },
  ...makeParametricSamplesAndGrid('u', 'v')
}

export const parametricSurfacaMeta: MetaData = {
  ...universal,
  ...surfaceLike,
  ...parametricSurfacaSpecific
}

// ---------- Explicit Surface (Rectangular) ---------- //

export const explicitSurfaceMeta: MetaData = {
  ...parametricSurfacaMeta,
  ...makeParametricSamplesAndGrid('x', 'y'),
  expr: {
    inputType: 'math',
    defaultValue: '_f(x,y)=x^2-y^2',
    isPrimary: true
  },
  rangeU: {
    inputType: 'math',
    defaultValue: '\\left[-2,\\ 2\\right]',
    isPrimary: true
  },
  rangeV: {
    inputType: 'math',
    defaultValue: '\\left[-2,\\ 2\\right]',
    isPrimary: true
  }
}

// ---------- ExplicitSurface Polar ---------- //

export const explicitSurfacePolarMeta: MetaData = {
  ...parametricSurfacaMeta,
  ...makeParametricSamplesAndGrid('r', '\u03B8'), // \u03B8 is lowercase theta
  expr: {
    inputType: 'math',
    defaultValue: '_f(r,\\theta)=\\frac{1}{4}r^2\\cdot\\cos\\left(3\\theta\\right)',
    isPrimary: true
  },
  rangeU: {
    inputType: 'math',
    defaultValue: '\\left[0,\\ 3\\right]',
    isPrimary: true
  },
  rangeV: {
    inputType: 'math',
    defaultValue: '\\left[-\\pi,\\ \\pi\\right]',
    isPrimary: true
  }
}

// ---------- Implicit Surface ---------- //
const implicitSurfaceSpecific: MetaData = {
  lhs: {
    inputType: 'math',
    defaultValue: 'f(x,y,z)=x^2+y^2',
    isPrimary: true
  },
  rhs: {
    inputType: 'math',
    defaultValue: 'f(x,y,z)=z^2+1',
    isPrimary: true
  },
  samples: {
    inputType: 'math',
    defaultValue: '20'
  },
  opacity: {
    inputType: 'math',
    defaultValue: '1'
  }
}

const volumetricRange = {
  rangeX: {
    inputType: 'math',
    defaultValue: '\\left[-5,\\ 5\\right]',
    isPrimary: true
  },
  rangeY: {
    inputType: 'math',
    defaultValue: '\\left[-5,\\ 5\\right]',
    isPrimary: true
  },
  rangeZ: {
    inputType: 'math',
    defaultValue: '\\left[-5,\\ 5\\right]',
    isPrimary: true
  }
}

export const implicitSurfaceMeta: MetaData = {
  ...universal,
  ...surfaceLike,
  ...volumetricRange,
  ...implicitSurfaceSpecific
}

// ---------- Vector Field ---------- //
const vectorFieldSpecific: MetaData = {
  expr: {
    inputType: 'math',
    defaultValue: 'f(x,y,z)=\\frac{[y,\\ -x,\\ 0]}{\\sqrt{x^2+y^2}}',
    isPrimary: true
  },
  samples: {
    inputType: 'math',
    defaultValue: '[10, 10, 5]'
  },
  scale: {
    inputType: 'math',
    defaultValue: '1'
  },
  width: {
    inputType: 'math',
    defaultValue: '2'
  },
  end: {
    inputType: 'boolean',
    defaultValue: true
  }
}

export const vectorFieldMeta: MetaData = {
  ...universal,
  ...lineLike,
  ...volumetricRange,
  ...vectorFieldSpecific
}

// ---------- Camera ---------- //
export const cameraMeta = {
  relativePosition: {
    inputType: 'math',
    defaultValue: '\\left[-1.25, -1.75, 0.5\\right]',
    isPrimary: true
  },
  relativeLookAt: {
    inputType: 'math',
    defaultValue: '\\left[0, 0, 0\\right]',
    isPrimary: true
  }
}

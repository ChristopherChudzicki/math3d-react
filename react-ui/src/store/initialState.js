import { rehydrate } from './hydration'

const initialState = {
  'sortableTree': {
    'root': [
      'mainFolder'
    ],
    'setup': [
      'cameraFolder',
      'axes'
    ],
    'cameraFolder': ['camera'],
    'axes': [
      'axis-x',
      'axis-y',
      'axis-z',
      'grid-xy',
      'grid-yz',
      'grid-zx'
    ],
    'mainFolder': []
  },
  'folders': {
    'cameraFolder': {
      'isCollapsed': true,
      'isDropDisabled': true,
      'isDragDisabled': true,
      'description': 'Camera Controls'
    },
    'axes': {
      'isCollapsed': false,
      'isDropDisabled': true,
      'isDragDisabled': true,
      'description': 'Axes and Grids'
    },
    'mainFolder': {
      'description': 'A Folder'
    }
  },
  'mathSymbols': {},
  'mathGraphics': {
    'camera': {
      type: 'CAMERA'
    },
    'axis-x': {
      'type': 'AXIS',
      'label': 'x'
    },
    'axis-y': {
      'type': 'AXIS',
      'label': 'y',
      'axis': 'y'
    },
    'axis-z': {
      'type': 'AXIS',
      'label': 'z',
      'axis': 'z',
      'scale': '1/2'
    },
    'grid-xy': {
      'type': 'GRID',
      'axes': 'xy'
    },
    'grid-yz': {
      'type': 'GRID',
      'visible': false,
      'axes': 'yz'
    },
    'grid-zx': {
      'type': 'GRID',
      'visible': false,
      'axes': 'zx'
    }
  }
}

export default rehydrate(initialState)

import { dehydrate, rehydrate } from './hydration'

const initialState = {
  "sortableTree": {
    "root": [
      "axes",
      "mainFolder"
    ],
    "axes": [
      "axis-x",
      "axis-y",
      "axis-z",
      "grid-xy",
      "grid-yz",
      "grid-zx"
    ],
    "mainFolder": []
  },
  "sliderValues": {},
  "folders": {
    "axes": {
      "description": "Axes and Grids",
      "isCollapsed": true,
      "isDropDisabled": true,
      "isDragDisabled": true
    },
    "mainFolder": {
      "description": "A Folder"
    }
  },
  "mathSymbols": {},
  "mathGraphics": {
    "axis-x": {
      "type": "AXIS",
      "label": "x"
    },
    "axis-y": {
      "type": "AXIS",
      "label": "y",
      "axis": "y"
    },
    "axis-z": {
      "type": "AXIS",
      "label": "z",
      "axis": "z",
      "scale": "1/2"
    },
    "grid-xy": {
      "type": "GRID",
      "axes": "xy"
    },
    "grid-yz": {
      "type": "GRID",
      "visible": false,
      "axes": "yz"
    },
    "grid-zx": {
      "type": "GRID",
      "visible": false,
      "axes": "zx"
    }
  },
  "parseErrors": {},
  "evalErrors": {},
  "renderErrors": {}
}



export default rehydrate(initialState)

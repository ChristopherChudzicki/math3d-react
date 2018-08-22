import React, { Fragment } from 'react'
import { Slider } from 'antd'
import PropTypes from 'prop-types'
import { MathInputRHS } from 'containers/MathObjects/containers/MathInput'

SliderWithLimits.propTypes = {
  value: PropTypes.number.isRequired,
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  onSliderChange: PropTypes.func.isRequired,
  parentId: PropTypes.string.isRequired
}

const limitStyle = { flex: 0 }

export default function SliderWithLimits(props) {
  return (
    <Fragment>
      <MathInputRHS
        parentId={props.parentId}
        style={limitStyle}
        field='min'
      />
      <div style={ { flex: 1 } }>
        <Slider
          min={props.minValue}
          max={props.maxValue}
          tipFormatter={null}
          value={props.value}
          step={0.01}
          onChange={props.onSliderChange}
        />
      </div>
      <MathInputRHS
        parentId={props.parentId}
        style={limitStyle}
        field='max'
      />
    </Fragment>
  )
}

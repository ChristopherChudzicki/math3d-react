import React from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'

export default function Point(props) {
  return (
    <MathObject description="Point" {...props}>
      <div>
        Point {props.id}
      </div>
    </MathObject>
  )
}

import React from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'

Point.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
}

export default function Point(props) {
  return (
    <MathObject {...props}>
      <div>
        Point {props.id}
      </div>
    </MathObject>
  )
}

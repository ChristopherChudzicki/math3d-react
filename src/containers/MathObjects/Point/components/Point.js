import React from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'

Point.propTypes = {
}

export default function Point(props) {
  return (
    <MathObject {...props}>
      <p></p>
    </MathObject>
  )
}

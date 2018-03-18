import React from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/components/MathObject'


export default function Point(props) {
  return (
    <MathObject title="Point" listIndex={props.listIndex} listLength={props.listLength}>
      <div>
        Point {props.id}
      </div>
    </MathObject>
  )
}

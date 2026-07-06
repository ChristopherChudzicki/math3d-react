import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  MathInputLHS,
  MathInputRHS,
  StaticMathStyled
} from '../../../../../containers/MathObjects/containers/MathInput'

SliderValueDisplay.propTypes = {
  parentId: PropTypes.string.isRequired,
  valueText: PropTypes.string.isRequired
}

const valueStyle = { flex: 0, width: '50px' }

export default function SliderValueDisplay(props) {
  return (
    <Fragment>
      <MathInputLHS
        parentId={props.parentId}
      />
      <StaticMathStyled
        latex='='
      />
      <MathInputRHS
        field='value'
        style={valueStyle}
        parentId={props.parentId}
        latex={props.valueText}
      />
    </Fragment>
  )
}

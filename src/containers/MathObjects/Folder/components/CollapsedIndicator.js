import React from 'react'
import { Icon } from 'antd'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  FOLDER_STATUS_WIDTH,
  FOLDER_STATUS_MARGIN
} from 'containers/MathObjects/components/MathObject'

const CollapseIndicatorButton = styled.button`
  margin: ${FOLDER_STATUS_MARGIN}px;
  width: ${FOLDER_STATUS_WIDTH}px;
  height: ${FOLDER_STATUS_WIDTH}px;
  background-color:rgba(1,0,0,0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

const RotatingSpan = styled.span`
  transition-duration: ${props => `${props.animationSpeed}ms`};
  &.collapsed {
    transform: rotate(-90deg);
  }
`

CollapsedIndicator.propTypes = {
  onToggleContentCollapsed: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  animationSpeed: PropTypes.number.isRequired
}

export default function CollapsedIndicator(props) {
  const className = props.isCollapsed ? 'collapsed' : ''
  return (
    <CollapseIndicatorButton
      onClick={props.onToggleContentCollapsed}
    >
      <RotatingSpan
        className={className}
        animationSpeed={props.animationSpeed}
      >
        <Icon
          type="down"
        />
      </RotatingSpan>

    </CollapseIndicatorButton>
  )
}

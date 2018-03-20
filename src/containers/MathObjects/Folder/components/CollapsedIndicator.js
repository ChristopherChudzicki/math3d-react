import React from 'react'
import { Button, Icon } from 'antd'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  FOLDER_STATUS_WIDTH,
  FOLDER_STATUS_MARGIN
} from 'containers/MathObjects/MathObject'

const CollapseIndicatorButton = styled(Button)`
  margin-left: ${FOLDER_STATUS_MARGIN/2}px;
  margin-right: ${FOLDER_STATUS_MARGIN/2}px;
  max-width: ${FOLDER_STATUS_WIDTH+FOLDER_STATUS_MARGIN}px;
  min-width: ${FOLDER_STATUS_WIDTH+FOLDER_STATUS_MARGIN}px;
  max-height: ${FOLDER_STATUS_WIDTH+FOLDER_STATUS_MARGIN}px;
  min-height: ${FOLDER_STATUS_WIDTH+FOLDER_STATUS_MARGIN}px;
  padding:0px;
  border-radius: ${props => props.theme.borderRadius};
`

const RotatingSpan = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
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

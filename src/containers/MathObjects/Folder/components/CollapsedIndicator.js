import React from 'react'
import { Button, Icon } from 'antd'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const CollapseIndicatorButton = styled(Button)`
  padding-left: 2px;
  padding-right: 2px;
  max-width: 22px;
  min-width: 22px;
  max-height: 22px;
  min-height: 22px;
  border-radius: ${props => props.theme.borderRadius};
  font-weight: 900;
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

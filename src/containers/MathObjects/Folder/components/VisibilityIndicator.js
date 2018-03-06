import React from 'react'
import { Icon } from 'antd'
import styled from 'styled-components'

const VisibilityButton = styled.button`
  margin:3px;
  width:20px;
  height:20px;
  background-color:rgba(1,0,0,0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

const RotatingSpan = styled.span`
  &.collapsed {
    transform: rotate(-90deg);
    transition-duration: ${props => `${props.animationSpeed}ms`};
  }
`

export function VisibilityIndicator(props) {
  const className = props.isCollapsed ? 'collapsed' : ''
  return (
    <VisibilityButton
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

    </VisibilityButton>
  )
}

export default VisibilityIndicator

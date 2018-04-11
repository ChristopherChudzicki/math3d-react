import React from 'react'
import { Icon } from 'antd'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import SubtleButton from 'components/SubtleButton'
import { theme } from 'theme'

const CollapseIndicatorButton = styled(SubtleButton)`
  padding-left: 2px;
  padding-right: 2px;
  width:28px;
  height:28px;
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
  animationSpeed: PropTypes.number.isRequired,
  lightenOnHover: PropTypes.bool.isRequired,
  backgroundColor: PropTypes.string.isRequired
}

export default function CollapsedIndicator(props) {
  const className = props.isCollapsed ? 'collapsed' : ''
  return (
    <CollapseIndicatorButton
      onClick={props.onToggleContentCollapsed}
      lightenOnHover={props.lightenOnHover}
      backgroundColor={props.backgroundColor}
      focusColor={theme.gray[6]}
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

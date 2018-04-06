import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Icon } from 'antd'
import SubtleButton from 'components/SubtleButton'

const StyledButton = styled(SubtleButton)`
  position:absolute;
  top:0;
  width:30px;
  height:30px;
  &.onRight {
    right:-30px;
  };
  &.onLeft {
    left:-30px;
  };
`

// slideTo, isDrawerOpen
const buttonIcons = {
  left: {
    true: 'left',
    false: 'right'
  },
  right: {
    true: 'right',
    false: 'left'
  }
}

export default function DrawerToggleButton(props) {
  const onClick = props.isDrawerOpen ? props.onClose : props.onOpen
  const iconType = buttonIcons[props.slideTo][props.isDrawerOpen]
  const classNames = props.onSide === 'right' ? 'onRight' : 'onLeft'
  return (
    <StyledButton onClick={onClick} className={classNames}>
      <Icon type={iconType} />
    </StyledButton>
  )
}

DrawerToggleButton.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  isDrawerOpen: PropTypes.bool.isRequired,
  slideTo: PropTypes.oneOf( ['left', 'right'] ),
  onSide: PropTypes.oneOf( ['left', 'right'] )
}

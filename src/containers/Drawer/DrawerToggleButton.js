import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ToggleButton = styled.button`
  position:absolute;
  top:0;
  width:50px;
  &.onRight {
    right:-50px;
  };
  &.onLeft {
    left:-50px;
  };
`

// slideTo, isDrawerOpen
const buttonIcons = {
  left: {
    true: '<',
    false: '>'
  },
  right: {
    true: '>',
    false: '<'
  }
}

export default function DrawerToggleButton(props) {
  const onClick = props.isDrawerOpen ? props.onClose : props.onOpen
  const icon = buttonIcons[props.slideTo][props.isDrawerOpen]
  const classNames = props.onSide === 'right' ? 'onRight' : 'onLeft'
  return (
    <ToggleButton onClick={onClick} className={classNames}>
      { icon }
    </ToggleButton>
  )
}

DrawerToggleButton.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  isDrawerOpen: PropTypes.bool.isRequired,
  slideTo: PropTypes.oneOf( ['left', 'right'] ),
  onSide: PropTypes.oneOf( ['left', 'right'] )
}

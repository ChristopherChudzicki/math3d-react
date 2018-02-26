import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ToggleButton = styled.button`
  position:absolute;
  top:0;
  right:-50px;
  width:50px;
`

export default function DrawerToggleButton(props) {
  const onClick = props.isDrawerOpen ? props.onClose : props.onOpen
  const icon = props.isDrawerOpen ? '<' : '>'
  return (
    <ToggleButton onClick = {onClick}>
      { icon }
    </ToggleButton>
  )
}

DrawerToggleButton.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  isDrawerOpen: PropTypes.bool.isRequired
}

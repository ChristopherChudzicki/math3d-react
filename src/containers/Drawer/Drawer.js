import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DrawerToggleButton from './DrawerToggleButton'

const DrawerContainer = styled.div`
  width: ${props => `${props.width}px`};
  min-width: ${props => `${props.width}px`};
  max-width: ${props => `${props.width}px`};
  position: relative;
  background-color:lightblue;
  height:100%;
  &.closing.left {
    transform: ${props => `translateX(-${props.width}px)`};
    transition-duration: 1s;
    margin-right: ${props => `-${props.width}px`};
  }
  &.opening.left {
    transform: translateX(0px);
    transition-duration: 1s;
    margin-right: 0;
  }
  &.closing.right {
    transform: ${props => `translateX(${props.width}px)`};
    transition-duration: 1s;
    margin-left: ${props => `-${props.width}px`};
  }
  &.opening.right {
    transform: translateX(0px);
    transition-duration: 1s;
    margin-right: 0;
  }
`

Drawer.propTypes = {
  width: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  slideTo: PropTypes.oneOf( ['left', 'right'] ).isRequired,
  children: PropTypes.oneOfType( [
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ] ).isRequired
}

Drawer.defaultProps = {
  width: 300,
  slideTo: 'left'
}

// Note: For slideTo:right to work properly, Drawer's container must have
// overflow:hidden
export default function Drawer(props) {
  const { width, children, isOpen, onOpen, onClose, slideTo } = props
  const animation = isOpen ? 'opening' : 'closing'
  const classNames = `${animation} ${slideTo}`
  const buttonSide = slideTo === 'left' ? 'right' : 'left'

  return (
    <DrawerContainer width={width} className={classNames}>
      {children}
      <DrawerToggleButton
        isDrawerOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        onSide={buttonSide}
        slideTo={slideTo}
      />
    </DrawerContainer>
  )
}

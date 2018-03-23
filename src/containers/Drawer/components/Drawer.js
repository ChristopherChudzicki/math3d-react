import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DrawerToggleButton from './DrawerToggleButton'
import classNames from 'classnames'

// These css classes control the opening/closing animation.
// Animation is done using CSS transitions & transforms.
// Transforms interfere with react-beautiful-dnd in Drawer children, so the
// default open class is implemented without any transforms
const DrawerContainer = styled.div`
  width: ${props => props.width};
  position: relative;
  background-color: ${props => props.theme.light};
  height:100%;
  &.closing-or-closed.left {
    transform: ${props => `translateX(-${props.width})`};
    transition-duration: ${props => props.animationSpeed};
    margin-right: ${props => `-${props.width}`};
  }
  &.opening.left {
    transform: translateX(0px);
    transition-duration: ${props => props.animationSpeed};
    margin-right: 0;
  }
  &.closing-or-closed.right {
    transform: ${props => `translateX(${props.width})`};
    transition-duration: ${props => props.animationSpeed};
    margin-left: ${props => `-${props.width}`};
  }
  &.opening.right {
    transform: translateX(0px);
    transition-duration: ${props => props.animationSpeed};
    margin-right: 0;
  }
`

/**
 * A sliding drawer component. Can be made to slide left or right off of These
 * viewport.
 *
 * Notes:
 *  - for rightward sliding drawer gto function correctly, Drawer's parent
 *    container must have overflow:hidden
 *  - css transforms are used to animate the sliding. However, no transforms
 *    are applied in drawer's open state.
 *
 */
export default function Drawer(props) {
  const {
    animationSpeed,
    width,
    children,
    isOpen,
    isAnimating,
    onOpen,
    onClose,
    slideTo
  } = props

  const className = classNames( {
    opening: isOpen && isAnimating,
    'closing-or-closed': !isOpen,
    left: slideTo === 'left',
    right: slideTo === 'right'
  } )

  const buttonSide = slideTo === 'left' ? 'right' : 'left'

  return (
    <DrawerContainer
      width={width}
      className={className}
      animationSpeed={animationSpeed}
    >
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

Drawer.propTypes = {
  width: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isAnimating: PropTypes.bool.isRequired,
  animationSpeed: PropTypes.string.isRequired,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  slideTo: PropTypes.oneOf( ['left', 'right'] ).isRequired,
  children: PropTypes.oneOfType( [
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ] ).isRequired
}

Drawer.defaultProps = {
  width: '300px',
  animationSpeed: '500ms',
  slideTo: 'left'
}

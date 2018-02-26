import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DrawerToggleButton from './DrawerToggleButton'

const DrawerContainer = styled.div`
  width: ${props => `${props.width}px`};
  position: relative;
  &.closing {
    transform: ${props => `translateX(-${props.width}px)`};
    transition-duration: 1s;
    margin-right: ${props => `-${props.width}px`};
  }
  &.opening {
    transform: translateX(0px);
    transition-duration: 1s;
    margin-right: 0;
  }
`
const DrawerContents = styled.div`
  width: ${props => `${props.width}px`};
  left: 0;
  background-color:lightblue;
  position:absolute;
  height:100%;
`

export default function Drawer(props) {
  const { width, children, isOpen, onOpen, onClose } = props
  const classNames = isOpen ? 'opening' : 'closing'

  return (
    <DrawerContainer width={width} className={classNames}>
      <DrawerContents width={width} className={classNames}>
        <span>Drawer Open: {JSON.stringify(isOpen)}</span>
        <div>
          {children}
        </div>
      </DrawerContents>
      <DrawerToggleButton
        isDrawerOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
    </DrawerContainer>
  )
}

Drawer.propTypes = {
  width: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.oneOfType( [
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ] ).isRequired
}

Drawer.defaultProps = {
  width: 300
}

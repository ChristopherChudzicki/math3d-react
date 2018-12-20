import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DrawerToggleButton from './DrawerToggleButton'
import classNames from 'classnames'

// These css classes control the opening/closing animation.
// Animation is done using CSS transitions & transforms.
// Transforms interfere with react-beautiful-dnd in Drawer children, so the
// default open class is implemented without any transforms
const DrawerContainer = styled.div`
  z-index:10;
  width: ${props => props.width};
  position: relative;
  background-color: ${props => props.theme.gray[1]};
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
export default class Drawer extends React.PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    isAnimating: PropTypes.bool.isRequired,
    animationSpeed: PropTypes.string,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    slideTo: PropTypes.oneOf( ['left', 'right'] ).isRequired,
    children: PropTypes.oneOfType( [
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ] ).isRequired
  }

  static defaultProps = {
    width: '300px',
    slideTo: 'left',
    animationSpeed: '1000ms'
  }

  constructor(props) {
    super(props)
    this.onClose = this.props.onClose.bind(this, this.props.id, this.props.animationSpeed)
    this.onOpen = this.props.onOpen.bind(this, this.props.id, this.props.animationSpeed)
  }

  render() {
    const {
      animationSpeed,
      width,
      children,
      isOpen,
      isAnimating,
      slideTo
    } = this.props

    const className = classNames( {
      opening: isOpen && isAnimating,
      'closing-or-closed': !isOpen,
      left: slideTo === 'left',
      right: slideTo === 'right'
    } )

    const buttonSide = slideTo === 'left' ? 'right' : 'left'

    return (
      <Fragment>
        {
          buttonSide === 'left' && isOpen && (
            <DrawerToggleButton
              isDrawerOpen={isOpen}
              onOpen={this.onOpen}
              onClose={this.onClose}
              side={buttonSide}
              slideTo={slideTo}
            />
          )
        }
        <DrawerContainer
          width={width}
          className={className}
          animationSpeed={animationSpeed}
        >
          {children}
        </DrawerContainer>
        {
          buttonSide === 'right' && (
            <DrawerToggleButton
              isDrawerOpen={isOpen}
              onOpen={this.onOpen}
              onClose={this.onClose}
              side={buttonSide}
              slideTo={slideTo}
            />
          )
        }
      </Fragment>
    )
  }

}

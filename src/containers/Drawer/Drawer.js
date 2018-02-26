import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

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

const DrawerToggle = styled.button`
  position:absolute;
  top:0;
  right:-50px;
  width:50px;
`

export default class Drawer extends PureComponent {

  static propTypes = {
    width: PropTypes.number,
    isVisible: PropTypes.bool,
    children: PropTypes.oneOfType( [
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ] ).isRequired
  }

  static defaultProps = {
    width: 300
  }

  state = {
    isOpen: true,
    animate: false
  }

  handleToggle = () => {
    this.setState( { isOpen: !this.state.isOpen, animate: true } )
  }

  render() {
    const { width, children } = this.props
    const { isOpen, animate } = this.state
    const classNames = isOpen && animate
      ? 'opening'
      : animate
        ? 'closing' : ''

    return (
      <Fragment>
        <DrawerContainer width={width} className={classNames}>
          <DrawerContents width={width} className={classNames}>
            <span>Drawer Visibility: {JSON.stringify(this.props.isVisible)}</span>
            <span>Drawer Open: {JSON.stringify(isOpen)}</span>
            <div>
              {children}
            </div>
          </DrawerContents>
          <DrawerToggle onClick={this.handleToggle}>
            Hello
          </DrawerToggle>
        </DrawerContainer>
      </Fragment>
    )
  }

}

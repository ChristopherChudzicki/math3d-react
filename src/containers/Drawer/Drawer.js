import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const DrawerContainer = styled.div`
  width: 0;
  position: relative;
  &.isOpen {
    width: ${props => `${props.width}px`};
  }
`
const DrawerContents = styled.div`
  width: ${props => `${props.width}px`};
  left: ${props => `-${props.width}px`};
  background-color:lightblue;
  position:absolute;
  height:100%;
  &.isOpen {
    left: 0
  }
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
    isOpen: true
  }

  handleToggle = () => {
    this.setState( { isOpen: !this.state.isOpen } )
  }

  render() {
    const { width, children } = this.props
    const { isOpen } = this.state
    return (
      <Fragment>
        <DrawerContainer width={width} className={isOpen ? 'isOpen' : ''}>
          <DrawerContents width={width} className={isOpen ? 'isOpen' : ''}>
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

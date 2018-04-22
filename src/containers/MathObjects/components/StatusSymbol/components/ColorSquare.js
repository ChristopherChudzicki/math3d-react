import React from 'react'
import styled from 'styled-components'
import PropType from 'prop-types'
import Pointable from 'react-pointable'

const Color = styled.div`
  background-color: ${props => props.color};
  border-radius: 5px;
  width: 30px;
  height: 30px;
  border: ${props => props.hover ? '1px solid black' : 'none'};
  cursor: pointer;
`

export default class ColorSquare extends React.PureComponent {

  static propTypes = {
    color: PropType.string.isRequired,
    onPickColor: PropType.func.isRequired
  }

  state = {
    hover: false
  }

  startHover = () => {
    this.setState( { hover: true } )
  }

  stopHover = () => {
    this.setState( { hover: false } )
  }

  onPointerUp = () => {
    this.props.onPickColor(this.props.color)
  }

  render() {
    return (
      <Pointable
        onPointerUp={this.onPointerUp}
        onPointerOver={this.startHover}
        onPointerOut={this.stopHover}
      >
        <Color
          color={this.props.color}
          hover={this.state.hover}
        />
      </Pointable>
    )
  }

}
